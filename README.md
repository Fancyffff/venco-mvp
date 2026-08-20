# 榛怡医务中心官网（vencokids.com）

榛怡医务中心（Venco Medical Centre）的正式官网，基于原交付版（venco.com.hk）重建升级：三级导航架构、疫苗页整页新建、图片全部自托管、三语言路由（繁中默认 `/`，英文 `/en/`，旧 `/zh/...` 301 到新地址）。

## 线上

- 生产：https://vencokids.com（Cloudflare Workers 自定义域名，`www` 已 301 到主域名）
- 原交付版 venco.com.hk 仍由客户方保留，域名切换待客户确认

## 常用命令

```bash
astro dev --background   # 本地开发（后台模式，用 astro dev stop/status/logs 管理）
npm run deploy           # astro build && wrangler deploy，直接发生产
```

## 内容都在数据文件里，尽量别动页面代码

- `src/data/site.json` — 简介（about/aboutEn + aboutBlocks 配图）、两个诊区（locations：地址、电话、**各自的 WhatsApp**）、营业时间、页脚信息
- `src/data/doctors.json` — 医生（`department` 主科室 + `alsoIn` 兼属科室，别复制数据）
- `src/data/services.json` / `education.json` / `vaccine.json` — 服务、科普文章、疫苗页（疫苗数字逐字来自诊所单张，改前问医生）
- 新增图片：先下载到 `public/assets/img/` 再引用，禁止外链（`scripts/fetch-images.mjs` 可补图）

## 改样式前必读

`docs/坑账本.md` —— 顶栏毛玻璃、body overflow 与 sticky、窄屏断点、疫苗页主次关系等都有前因后果，别凭感觉重构。
