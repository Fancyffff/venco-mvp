# Wenco

Venco Medical Centre 的双语生产官网，按 **L1 → L2 → L3** 信息架构组织服务、医生与儿科教育内容。

## 信息架构

| | 旧站 | 当前站点 |
|---|---|---|
| 顶栏 | 只有一级扁平链接 | **三级菜单**：服务分类 → 细项/医生；医生分组 → 成员 |
| 服务页 | 11 个专科堆在同一长页 | **拆页**：总览 → `/services/{专科}/` → `/services/{专科}/{细项}/` |
| 医生跳转 | 头像 popover + WhatsApp | 链到 `/doctors/{科室}/#id` |

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:4321/`，悬停「兒科服務 / 醫生團隊」看三级菜单。

## 技术

- Astro 7
- 内容：`src/data/*.json`（从线上抓取）
- 图片：本地托管于 `public/assets/img/`
- 部署：Cloudflare，正式域名 `vencokids.com`

## 项目文档

- [产品规格](./SPEC.md)
- [技术架构](./ARCHITECTURE.md)
- [变更记录](./CHANGELOG.md)
- [待办清单](./TODO.md)
