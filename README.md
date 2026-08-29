# 2086 编年史 · 正史

一个基于飞书文档自动同步的互动式时间轴网页小说。

🔗 **在线阅读**：https://martintintintintin.github.io/2086_time_line/

## 项目简介

从飞书云文档到 GitHub Pages 的自动化发布流程。在飞书文档中写作，运行同步脚本后内容自动推送到线上网页。

## 技术栈

- **数据源**：飞书云文档（Docx）
- **同步工具**：Node.js + 飞书 OpenAPI，自动提取文档内容并生成 JSON
- **前端**：纯原生 HTML/CSS/JS，无框架依赖
- **部署**：GitHub Pages

## 核心功能

- 三层背景图切换（年份/章节/默认）+ 毛玻璃遮罩
- 雨丝粒子动效 + 视差滚动
- 左侧时间轴浮动动画
- 行内注解系统（点击词条，右侧面板展开补充说明/图片/参考链接）
- 图片自动压缩（WebP 格式，27MB → 1.5MB）
- 响应式布局（时间轴 15vw，正文 70vw）

## 目录结构

```
2086_time_line/
├── index.html          # 入口页面
├── content.json        # 正文数据（自动生成）
├── annotations.json    # 注解数据（自动生成）
├── images.json         # 图片清单
├── images/             # 背景图 + 注解图
├── css/style.css       # 全局样式
└── js/
    ├── config.js       # 所有可调参数集中管理
    ├── main.js         # 入口逻辑
    ├── data-loader.js  # 数据加载
    ├── text-renderer.js # 正文渲染
    ├── background.js   # 背景切换
    ├── timeline.js     # 时间轴
    ├── annotation.js   # 注解面板
    └── rain.js         # 雨丝动效
```

## 更新流程

1. 在飞书文档中编辑正文和注解
2. 运行同步脚本：`node sync_chronicle.js`
3. 推送到 GitHub：
   ```
   git add .
   git commit -m "update content"
   git push
   ```
4. GitHub Pages 自动构建，1-2 分钟后线上更新
