/**
 * mteamHijack.js
 * M-Team /search 劫持路由（由参考仓库 PT_Fall-View/src/lib/hijack.js 的 Launch_Hijack 移植而来）
 *
 * 功能：
 *  1. 拦截 XMLHttpRequest.prototype.open / send 以及 window.fetch 中对目标路径（默认 '/search'）
 *     的 POST 请求，捕获请求与响应，并派发 window 自定义事件 'req>POST->/search' 与 'res>POST->/search'。
 *  2. 使用 WeakMap 存储每个实例的元数据，避免原型污染。
 *  3. 暴露统一的单例处理器消费者对象 window.__kesaHijack = { handler: null }，
 *     并提供辅助方法 window.__kesaHijackInject(data)，用于手动注入响应数据。
 *
 * 注意：本模块仅供自用，未配置 '@' 路径别名，请使用相对路径导入。
 */

/**
 * 启动劫持路由（移植自 Launch_Hijack）
 * @param {Object} [param] 配置参数
 * @param {string} [param.path='/search'] 目标路径
 * @param {string} [param.method='POST'] 目标请求方法
 * @returns {Function} 清理函数，调用后可恢复原生 XHR / fetch 行为
 */
export function Launch_Hijack(param = { path: '/search', method: 'POST' }) {
  // 提取参数并设置默认值
  const path = param.path || '/search';
  const method = param.method || 'POST';

  // 确保必要的 API 可用
  if (typeof XMLHttpRequest === 'undefined') {
    console.warn('[mteamHijack] XMLHttpRequest not available, skipping hijack');
    return () => {}; // 返回空清理函数
  }

  // 保存原生方法
  const nativeOpen = XMLHttpRequest.prototype.open;
  const nativeSend = XMLHttpRequest.prototype.send;
  const nativeFetch = window.fetch;

  // 使用 WeakMap 存储每个 XHR 实例的元数据，避免污染原型
  const requestMetadataMap = new WeakMap();
  const capturedFlags = new WeakSet();

  // 检查是否为目标请求
  /** @type {(url: string, requestMethod: string) => boolean} */
  function isTargetRequest(url, requestMethod) {
    if (!url.includes(path)) return false;
    if (requestMethod.toUpperCase() !== method.toUpperCase()) return false;
    return true;
  }

  // 解析响应内容
  /** @type {(xhr: XMLHttpRequest) => any} */
  function parseResponse(xhr) {
    try {
      switch (xhr.responseType) {
        case 'json':
          return xhr.response;
        case 'document':
          return xhr.responseXML?.documentElement.textContent || null;
        case 'arraybuffer':
          return new Uint8Array(xhr.response);
        case 'blob':
          return URL.createObjectURL(xhr.response);
        default:
          return xhr.responseText;
      }
    } catch {
      return xhr.responseText;
    }
  }

  // 捕获响应数据
  /** @type {(xhr: XMLHttpRequest) => void} */
  function captureResponseData(xhr) {
    const metadata = requestMetadataMap.get(xhr);
    if (!metadata || !metadata.isTarget || capturedFlags.has(xhr)) {
      return;
    }

    try {
      const responseData = {
        status: xhr.status,
        headers: xhr.getAllResponseHeaders(),
        data: parseResponse(xhr)
      };

      // 触发自定义事件
      const event = new CustomEvent(`res>${method}->${path}`, { detail: responseData });
      window.dispatchEvent(event);
      capturedFlags.add(xhr);
    } catch (e) {
      console.error('<mteamHijack> Capture failed:', e);
    }
  }

  // 劫持 open 方法
  XMLHttpRequest.prototype.open = function(method, url) {
    const metadata = {
      method: method.toUpperCase(),
      url: url,
      isTarget: isTargetRequest(url, method)
    };
    requestMetadataMap.set(this, metadata);
    return nativeOpen.apply(this, arguments);
  };

  // 劫持 send 方法
  XMLHttpRequest.prototype.send = function(body) {
    const metadata = requestMetadataMap.get(this);

    if (metadata?.isTarget) {
      const originalOnReadyStateChange = this.onreadystatechange;
      const originalOnLoad = this.onload;

      // 监听 readystatechange
      this.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          captureResponseData(this);
        }
        originalOnReadyStateChange?.call(this);
      });

      // 兼容 onload
      this.onload = function(e) {
        captureResponseData(this);
        originalOnLoad?.call(this, e);
      };

      // 记录请求体
      const reqBody = {
        url: metadata.url,
        body: body instanceof Document ? body.documentElement.textContent || '[Document]' : body
      };

      // 触发请求事件
      const event = new CustomEvent(`req>${method}->${path}`, { detail: reqBody });
      window.dispatchEvent(event);
    }

    return nativeSend.apply(this, arguments);
  };

  // 劫持 fetch 方法（如果可用）
  if (nativeFetch) {
    window.fetch = async function(...args) {
      const [input, init = {}] = args;
      const url = typeof input === 'string' ? input : (input instanceof Request ? input.url : String(input));
      const requestMethod = (init.method || 'GET').toUpperCase();
      const requestBody = init.body;

      // 检查是否为目标请求
      const isTarget = isTargetRequest(url, requestMethod);

      // 触发请求事件
      if (isTarget) {
        const reqBody = {
          url: url,
          body: requestBody instanceof Document ? requestBody.documentElement.textContent || '[Document]' : requestBody
        };
        const event = new CustomEvent(`req>${method}->${path}`, { detail: reqBody });
        window.dispatchEvent(event);
      }

      // 调用原生 fetch
      return nativeFetch.apply(this, args).then(response => {
        if (isTarget) {
          // 克隆响应以便读取
          const responseClone = response.clone();

          // 提取响应数据
          const contentType = response.headers.get('content-type') || '';
          const isJson = contentType.includes('application/json');

          return responseClone[isJson ? 'json' : 'text']().then(data => {
            // 触发响应事件
            const responseData = {
              status: response.status,
              headers: Array.from(response.headers.entries()).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
              }, /** @type {Record<string, string>} */ ({})),
              data: isJson ? JSON.stringify(data) : data
            };

            const event = new CustomEvent(`res>${method}->${path}`, { detail: responseData });
            window.dispatchEvent(event);

            // 返回原始响应
            return response;
          }).catch(error => {
            console.error('<mteamHijack> Failed to parse fetch response:', error);
            return response;
          });
        }

        return response;
      });
    };
  } else {
    console.warn('[mteamHijack] fetch API not available, skipping fetch hijack');
  }

  // 返回清理函数
  return function cleanup() {
    XMLHttpRequest.prototype.open = nativeOpen;
    XMLHttpRequest.prototype.send = nativeSend;
    if (nativeFetch) {
      window.fetch = nativeFetch;
    }
  };
}

/**
 * 统一的单例处理器消费者对象，暴露在 window 上。
 * 形状：{ handler: null }
 * - 外部可通过 window.__kesaHijack.handler = fn 注册处理器
 * - 通过 window.__kesaHijackInject(data) 手动注入响应数据
 */
const __kesaHijack = {
  handler: null
};

// 挂载到 window 上（若浏览器环境存在 window）
if (typeof window !== 'undefined') {
  window.__kesaHijack = __kesaHijack;

  /**
   * 手动注入响应数据辅助函数。
   * 若已注册 handler，则以 'res' 类型事件调用 handler，并返回 true；否则返回 false。
   * @param {any} data 需要注入的数据
   * @returns {boolean} 是否成功注入（是否已注册 handler）
   */
  window.__kesaHijackInject = function(data) {
    if (window.__kesaHijack && typeof window.__kesaHijack.handler === 'function') {
      window.__kesaHijack.handler({
        type: 'res',
        data: JSON.stringify({ data: { data, pageNumber: 1 } })
      });
      return true;
    }
    return false;
  };
}

// ES 模块导出，供相对路径导入使用
export { __kesaHijack };
