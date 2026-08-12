# Venco MVP（竞品演示）

从线上 [venco.com.hk](https://venco.com.hk/zh) 扒取文案/图片，按客户要求的 **L1 → L2 → L3** 导航架构重建。

## 和原站差异（卖点）

| | 原站 | 本 MVP |
|---|---|---|
| 顶栏 | 只有一级扁平链接 | **三级菜单**：服务分类 → 细项/医生；医生分组 → 成员 |
| 服务页 | 11 个专科堆在同一长页 | **拆页**：总览 → `/services/{专科}/` → `/services/{专科}/{细项}/` |
| 医生跳转 | 头像 popover + WhatsApp | 链到 `/zh/doctors/#id` |

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:4321/zh/`，悬停「兒科服務 / 醫生團隊」看三级菜单。

## 技术

- Astro 7
- 内容：`src/data/*.json`（从线上抓取）
- 图片：热链 `img.venco.com.hk`（演示用）
