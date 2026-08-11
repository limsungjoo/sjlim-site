#!/usr/bin/env node
// 새 노트/결정 파일을 만든다. 자기 기록은 문턱이 낮아야 쌓인다.
//   npm run new -- note infra "aws CLI 빈 prefix 함정"
//   npm run new -- decision control "배치 소유권" --draft
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LAYERS = ['model', 'agent', 'infra', 'control'];

const argv = process.argv.slice(2);
const draft = argv.includes('--draft');
const [kind, layer, ...titleParts] = argv.filter((a) => a !== '--draft');
const title = titleParts.join(' ').trim();

function die(msg) {
  console.error(`\n  ${msg}\n`);
  console.error('  사용법: npm run new -- <note|decision> <layer> "제목" [--draft]');
  console.error(`  layer : ${LAYERS.join(' | ')}\n`);
  process.exit(1);
}

if (kind !== 'note' && kind !== 'decision') die(`알 수 없는 종류: ${kind ?? '(없음)'}`);
if (!LAYERS.includes(layer)) die(`알 수 없는 layer: ${layer ?? '(없음)'}`);
if (!title) die('제목이 비었습니다.');

// 한글 제목이면 슬러그를 못 만드니 날짜 기반으로 떨어뜨리고 나중에 고치게 둔다.
const today = new Date().toISOString().slice(0, 10);
const asciiSlug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');
const slug = asciiSlug || `${kind}-${today}`;

const dir = join(ROOT, 'src/content', kind === 'note' ? 'notes' : 'decisions');
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
layer: ${layer}
status: rough
tags: []
draft: ${draft}
---

`
    : `---
title: ${title}
summary:
decided: ${today}
layer: ${layer}
status: active
tags: []
draft: ${draft}
---

## 맥락

무엇 때문에 정해야 했나.

## 선택지

-
-

## 고른 것

왜 이걸 골랐나.

## 버린 것

무엇을 버렸고, 어떤 조건이면 다시 볼 건가.
`;

await mkdir(dir, { recursive: true });
await writeFile(file, front, 'utf-8');
console.log(`\n  ${file.replace(ROOT + '/', '')}\n`);
