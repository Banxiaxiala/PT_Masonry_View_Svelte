# [PT_Masonry] PT 瀑布流视图<br><span style="font-size:20px;">目前支持站点: </span><span style="font-size:20px;font-weight:700;color:red;"> Kame MT </span>

<!-- ./video.mp4 -->

<!-- https://github.com/KesaubeEire/PT_Masonry_View_Svelte/raw/newMT/readme/video.mp4 -->

https://github.com/KesaubeEire/PT_Masonry_View_Svelte/assets/20382002/3e827f13-2586-4e2c-9f1d-daa24b809df8

![pic_cover](https://raw.githubusercontent.com/KesaubeEire/PT_Masonry_View_Svelte/newMT/readme/pic_cover.png)

<s style="color:gray;">(虽然 M-Team 也自带了,但我纠结很久还是不放弃了捏 🤡)</s>  
这是一个有着丰富配置选项的瀑布流脚本, 功能包括但不限于:

- 悬浮预览查看大图
  <br>
  <span style="color:green;">大图尽可能大</span>

    ![pic_hover](https://raw.githubusercontent.com/KesaubeEire/PT_Masonry_View_Svelte/newMT/readme/pic_hover.png)

- 内置种子详情窗口
  <br>
  <span style="color:orange;">不需要在新页面看种子详情了!</span>

    ![pic_detail](https://raw.githubusercontent.com/KesaubeEire/PT_Masonry_View_Svelte/newMT/readme/pic_detail.png)

- 界面可配置选项丰富

    ![pic_config](https://raw.githubusercontent.com/KesaubeEire/PT_Masonry_View_Svelte/newMT/readme/pic_config.png)

  - <span style="color:orange;">MT 专属: 屏蔽 Gay 片</span>
  - 卡片信息自由配置
  - 瀑布流加载方式可选: 点击加载 & 滚动加载
  - 自由调整瀑布流列数和间隔
  - 其他细节选项...

---

## 小技巧:

(可能会时常调整)

<!-- TODO: 这里要调整 -->

- 手动整理卡片: 
  1. 可以点击卡片之间的缝隙  
  2. 可以点击侧边栏的整理按钮  
- 双击切换按钮可以重置瀑布流布局 TODO: 让整理按钮也能重置布局  
  <span style="color:orange;">改变浏览器宽度的话布局会乱</span>

    ![pic_flowPanel](https://raw.githubusercontent.com/KesaubeEire/PT_Masonry_View_Svelte/newMT/readme/pic_flowPanel.png)

- 如果页面上的浮动快捷面板(也就是侧边栏,见上图)丢失,   
  请拉到页面最下方的 <重置瀑布流配置边栏位置> 按钮,  
  会重置到页面左上角  
---

## 其他特色

- 图片懒加载: 节省性能
- 开启动画比关闭动画节省性能: 重绘次数减少
- **原生的种子列表同样支持悬浮大图和内置种子详情窗口**
- 填充文本...

## 其他信息

- [Full Readme(含 TODO)](https://github.com/KesaubeEire/PT_Masonry_View_Svelte/blob/newMT/README.md)
- [Github 地址](https://github.com/KesaubeEire/PT_Masonry_View_Svelte/tree/newMT)
- [油猴 地址](https://greasyfork.org/zh-CN/scripts/470821)
- [旧版 Readme(24.4.14)](./readme/readme_old.md)
- [旧版 Github 地址](https://github.com/KesaubeEire/PT_TorrentList_Masonry)
- [旧版 油猴 地址](https://greasyfork.org/zh-CN/scripts/465249-pt种子列表无限下拉瀑布流视图)

## TODO LIST

- 重要功能
  - [ ] 劫持 XMLHttpRequest 重构瀑布流
  - [ ] 适配 mnk?
  - [ ] TODO: (搁置, 暂时无冲突)原生表格悬浮预览功能放到 MT可选配置 里, 防止和其他同功能脚本冲突  
  
- 次要
  - [ ] 内置说明里标记同步 user.config 的版本号
  - [ ] TODO: 分类显示可配置? 图标 or 文字 or 都有? 再想想哈
  - [ ] TODO: 分类图标类似局部悬浮显示触发那样放在左上角
  - [ ] TODO: 分类搞三种语言, 从 Localstorage 里搞过来就行
  
- 体验
  - [ ] TODO: Kame 特色: table.main 的 css和html 的 width 改为 100% (可选项) 
  - [ ] 优化滚动模式体验: 翻页条显示加载中之类的状态
  - [ ] 搞个内置的使用说明

## FEATURE HISTORY  
- 主要
  - [x] 悬浮预览重构: 拆分后妥协解决 [2024.4.16 v1.1.10]
  - [x] 原生表格内置窗口显示 [2024.4.16 v1.1.10]
  - [x] 原生表格图片悬浮预览 -> 还原旧版图片预览 [2024.4.16 v1.1.10]

- 次要
  - [x] 文件结构整理: svg [2024.4.27 v1.1.10]
  - [x] dark-reader 适配: svg => svelte [2024.4.21 v1.1.10]
  - [x] 配置栏的配色固定起来, 防止本站 CSS 污染 [2024.4.18 v1.1.10]
  - [x] 更新 M-Team 的电子书分区 [2024.4.16 v1.1.10]

- 体验
  - [x] 无需刷新即可直接从非 /browse 跳入后显示瀑布流 [2024.4.18 v1.1.10]
  - [x] 做一个全新的 readme [2024.4.14 v1.1.10]
  - [x] 在 M-Team 的论坛好好优化一下介绍 [2024.4.14]  
  - [x] 侧边栏拓展: 整理瀑布流 [2024.4.18 v1.1.10] 

- 应对主站更新
  - [x] 240701: 应对 M-team 主站 api 统一更新为 api.m-team.xxxx
  - [x] 250111: 应对 M-team 主站 api 添加 Ts 的请求头

## FIX HISTORY
- MT /detail 编辑种子失效 <直接脚本排除了, 算是糊弄过去了> [2024.5.11 v1.1.12]
- js 丢失 svelte store 环境的bug => 论坛编辑帖子会崩溃 (C.state 相关) <套了一层 Svelte 解决> [2024.5.11 v1.1.12]
- M-Team api 更新修复 [2024.4.29 v1.1.11]
- Kame 不知道为什么图片的底边 margin 会多出来 3px, 这里抵消掉 [2024.4.27 v1.1.10]
- 调整 ant-menu-sub-popup 的 css 样式层级 [2024.4.27 v1.1.10]
- NEXUS_TOOL 关闭初始化 kp_container 的 display 值 [2024.4.17 v1.1.10]
- NEXUS_TOOL imgEle 变量丢失报错 [2024.4.16 v1.1.10]
- 瀑布流页数错误 [2024.4.14 v1.1.10]
- iframe 聚焦轮询丢失对象报错 [2024.4.14 v1.1.10]

## 问题反馈

有些渠道和平台可能平常不会关注  
如果有遇到 bug 或者有什么其他功能的需求或者建议  
欢迎来 TG 群组反馈: [PT_Masonry](https://t.me/+wLPO7JyNz_o1YWRl)