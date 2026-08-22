# Wenco 技术架构

## 1. 架构概览

项目是基于 Astro 7 的静态内容站。构建时从本地 JSON 读取内容，并为中英文及动态内容路径生成静态页面。浏览器端脚本只负责菜单、搜索和少量交互。

```text
src/data/*.json
      │
      ├── 页面路由 src/pages/**（中文根路径与英文 `/en`）
      ├── 搜索索引 src/lib/search.ts
      └── 导航组件 src/components/Header.astro
                       │
                       ▼
              Astro 静态构建
                       │
                       ▼
                 dist 静态站点
```

## 2. 技术栈

- Node.js 22.12 或以上
- Astro 7
- TypeScript/JavaScript（ES Modules）
- Astro 组件与原生 CSS
- JSON 内容数据
- npm 或 pnpm 依赖管理

## 3. 目录职责

```text
public/                 本地静态资源
src/components/         Header、Footer 等全站组件
src/data/               服务、医生、教育、站点和文件数据
src/layouts/            页面基础布局与全局元数据
src/lib/                多语言、内容映射与搜索逻辑
src/pages/              繁体中文根路由
src/pages/en/           英文路由
src/styles/             全局样式
astro.config.mjs        Astro 配置与旧路径重定向
```

## 4. 路由结构

中文使用根路径，英文使用 `/en` 前缀。以下以 `{prefix}` 表示空字符串或 `/en`：

```text
{prefix}/
{prefix}/about/
{prefix}/contact/
{prefix}/disclaimer/
{prefix}/search/
{prefix}/services/
{prefix}/services/{specialty}/
{prefix}/services/{specialty}/{item}/
{prefix}/doctors/
{prefix}/doctors/{department}/
{prefix}/education/
{prefix}/education/{category}/
{prefix}/education/{category}/{article}/
```

动态路由通过 Astro `getStaticPaths` 在构建时从 JSON 数据展开。旧的扁平教育文章 URL 和已知拼写错误由 `astro.config.mjs` 重定向。

## 5. 数据模型与关系

- `services.json`：专科、服务细项和关联医生 ID
- `doctors.json`：医生资料、所属科室和图片
- `education-categories.json`：教育主题分类
- `education.json`：文章、分类 ID、正文与关联信息
- `documents.json`：可下载文件资料
- `site.json`：诊所名称、联系方式和通用站点内容
- `disclaimer.json`：免责声明内容

核心关联使用稳定的 `id`、`slug`、`department` 和 `category` 字段。修改这些字段时，需要同步检查相关 URL 和引用。

## 6. 多语言策略

- 路由级隔离：中文根路径与 `/en/`
- 通用界面文案和英文映射集中在 `src/lib/i18n.ts`
- `localePath` 负责生成本地化路径
- `switchLocalePath` 在语言切换时保留页面层级
- 当前部分英文内容由映射或原始数据回退生成，并非独立 CMS 内容版本

## 7. 搜索

`src/lib/search.ts` 在构建/加载时从本地 JSON 组成搜索索引。搜索在浏览器内完成，不依赖服务端或外部搜索服务。

## 8. 资源与部署

- Logo、图标及内容图片位于 `public/assets/`
- 构建产物为 `dist/`，通过 Cloudflare 静态资源托管发布至 `vencokids.com`
- `wrangler.jsonc` 定义自定义域名、静态资源目录、404 与可观测性配置
- 构建时生成 Cloudflare `_redirects`，用于旧中文路径及内容旧地址的 301 跳转
- 项目当前没有数据库、服务端 API、CMS 或环境变量依赖

## 9. 主要风险

- 中英文页面分别实现，结构修改时可能发生功能漂移
- JSON 缺少 schema 校验，错误关联可能到构建或页面检查时才发现
- 当前没有自动化测试与持续集成配置
