/**
 * 一次性图片本地化脚本（跑完保留备查）。
 *
 * 站上的图原本全是外链客户旧站 img.venco.com.hk。旧站改版或清 uploads
 * 目录，新站就整片开天窗，所以统一抓到 public/assets/img/ 自己托管。
 *
 * 用法：node scripts/fetch-images.mjs
 * 可重复执行：已经下载过的文件会跳过，json 里已是本地路径的不会再动。
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'src', 'data');
const outDir = path.join(root, 'public', 'assets', 'img');
// 客户旧站的两个图床：CMS 主图床 + 早期 workers.dev 临时域名。
const REMOTE = /https:\/\/(?:img\.venco\.com\.hk|nano-cms-production\.vencomedicalcentre\.workers\.dev)\/[^"'\s)]+/g;
const PUBLIC_PREFIX = '/assets/img/';

const localName = (url) => decodeURIComponent(new URL(url).pathname.split('/').pop());

async function collectUrls(files) {
  const urls = new Set();
  for (const f of files) {
    const text = await readFile(f, 'utf8');
    for (const m of text.matchAll(REMOTE)) urls.add(m[0]);
  }
  return [...urls];
}

async function download(url, dest) {
  if (existsSync(dest)) return 'skip';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return 'ok';
}

const jsonFiles = (await readdir(dataDir))
  .filter((f) => f.endsWith('.json'))
  .map((f) => path.join(dataDir, f));

const urls = await collectUrls(jsonFiles);
console.log(`发现 ${urls.length} 个外链图片`);
if (!urls.length) {
  console.log('没有需要处理的外链，退出。');
  process.exit(0);
}

await mkdir(outDir, { recursive: true });

// 不同 URL 落到同名文件会互相覆盖，先挡掉。
const byName = new Map();
for (const url of urls) {
  const name = localName(url);
  if (byName.has(name) && byName.get(name) !== url) {
    throw new Error(`文件名冲突：${name}\n  ${byName.get(name)}\n  ${url}`);
  }
  byName.set(name, url);
}

let ok = 0;
let skipped = 0;
const failed = [];
for (const [name, url] of byName) {
  try {
    const r = await download(url, path.join(outDir, name));
    r === 'ok' ? ok++ : skipped++;
  } catch (err) {
    failed.push(`${url} → ${err.message}`);
  }
}
console.log(`下载 ${ok} 张，已存在跳过 ${skipped} 张，失败 ${failed.length} 张`);
if (failed.length) {
  console.error('失败清单（json 里对应条目保持原样，不会被替换成本地路径）：');
  failed.forEach((f) => console.error('  ' + f));
}

// 只替换真正拿到手的图，失败的保留外链，免得页面直接 404。
const downloaded = new Set(await readdir(outDir));
let touched = 0;
for (const file of jsonFiles) {
  const before = await readFile(file, 'utf8');
  const after = before.replace(REMOTE, (url) => {
    const name = localName(url);
    return downloaded.has(name) ? PUBLIC_PREFIX + name : url;
  });
  if (after !== before) {
    await writeFile(file, after);
    touched++;
    console.log(`已更新 ${path.relative(root, file)}`);
  }
}

const total = (await Promise.all(
  [...downloaded].map(async (n) => (await stat(path.join(outDir, n))).size),
)).reduce((a, b) => a + b, 0);
console.log(`完成：${touched} 个数据文件已改写，本地图片共 ${(total / 1024 / 1024).toFixed(1)} MB`);
if (failed.length) process.exitCode = 1;
