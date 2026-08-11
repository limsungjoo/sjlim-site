#!/usr/bin/env node
// 새 글/노트 파일을 만든다. 노트는 문턱이 낮아야 쌓인다.
//   npm run new -- note "aws CLI 빈 prefix 함정"
//   npm run new -- post "재현 가능하다는 말은 무엇을 증명하는가"
//   npm run new -- note "아직 정리 안 된 것" --draft
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const argv = process.argv.slice(2);
const draft = argv.includes('--draft');
const [kind, ...titleParts] = argv.filter((a) => a !== '--draft');
const title = titleParts.join(' ').trim();

function die(msg) {
  console.error(`\n  ${msg}\n`);
  console.error('  사용법: npm run new -- <note|post> "제목" [--draft]\n');
  process.exit(1);
}

if (kind !== 'note' && kind !== 'post') die(`알 수 없는 종류: ${kind ?? '(없음)'}`);
if (!title) die('제목이 비었습니다.');

// 한글 제목이면 슬러그를 못 만드니 날짜 기반으로 떨어뜨리고 나중에 파일명만 고치게 둔다.
const today = new Date().toISOString().slice(0, 10);
const asciiSlug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');
const slug = asciiSlug || `${kind}-${today}`;

const dir = join(ROOT, 'src/content', kind === 'note' ? 'notes' : 'writing');
const file = join(dir, `${slug}.md`);

try {
  await access(file);
  die(`이미 있습니다: ${file}`);
} catch {
  /* 없으면 정상 */
}

const front =
  kind === 'note'
    ? `---
title: ${title}
summary:
created: ${today}
status: rough
tags: []
draft: ${draft}
---

`
    : `---
title: ${title}
summary:
date: ${today}
tags: []
# series: series-slug        # 시리즈에 넣을 때만
# part: 1
draft: ${draft}
---

`;

await mkdir(dir, { recursive: true });
await writeFile(file, front, 'utf-8');
console.log(`\n  ${file.replace(ROOT + '/', '')}\n`);
