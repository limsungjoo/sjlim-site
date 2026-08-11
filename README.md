# sjlim-site

Astro 7 + Tailwind 4 정적 사이트.
배포: https://limsungjoo.github.io/sjlim-site/

```bash
npm install
npm run dev      # http://localhost:4321/sjlim-site/
npm run build
npm run preview
```

## 구조

```
/            Portfolio 3 + Writing 3 + Notes 4 미리보기
/portfolio/  만든 것
/writing/    긴 글. 발행일 순
/notes/      짧은 노트. 최종 수정일 순
```

### Writing 과 Notes 를 가르는 기준

| | Writing | Notes |
| --- | --- | --- |
| 길이 | 한 화면 이상 | 몇 줄 ~ 한 화면 |
| 축 | 발행일 (`date`) | 최종 수정일 (`updated ?? created`) |
| 정정 | 새 글 | 그 노트를 고침 |
| 상태 표시 | 없음 | `rough` / `verified` / `overturned` |

`aws CLI 빈 prefix 함정` 같은 세 줄짜리는 Writing 에 못 올린다.
"글을 쓴다"는 문턱 때문에 결국 아무데도 안 쌓인다. 그래서 Notes 를 따로 둔다.

### Notes 의 status

정리된 것만 올리려 하면 아무것도 안 올라온다.
`rough` 를 1급으로 두어 정리 안 된 채로도 공개할 수 있게 한다.

```
rough        아직 정리 안 됨. 그때의 기록 그대로
verified     직접 확인함
overturned   나중에 틀린 걸 알게 됨. 왜 틀렸는지는 본문에
```

틀린 노트는 지우지 않는다. `overturned` 로 바꾸고 본문에 이유를 적는다.

정말 남에게 안 보일 것은 `draft: true`.
프로덕션 빌드에서 빠지고 `npm run dev` 에서만 보인다.

### Series

목차 칸은 없다. Writing 글에 붙는 라벨로만 쓴다.

- 목록에서는 `시리즈명 · 02` 로 레일에 표시
- 글 페이지 상단에 편 목록(스파인)이 뜨고 편끼리 이동 가능

## 쓰기

```bash
npm run new -- note "aws CLI 빈 prefix 함정"
npm run new -- post "재현 가능하다는 말은 무엇을 증명하는가"
npm run new -- note "아직 정리 안 된 것" --draft
```

한글 제목은 슬러그를 못 만들어 `note-<날짜>.md` 로 떨어진다. 파일명만 고치면 된다.

### note frontmatter

```yaml
title: aws CLI 는 빈 prefix 에서 KeyCount 를 안 준다
summary: 목록에 뜨는 한 줄
created: 2026-08-04
updated: 2026-08-11   # 고쳤을 때만. 목록에 * 로 표시된다
status: verified      # rough | verified | overturned
tags: [aws, s3, 함정]
draft: false
```

### writing frontmatter

```yaml
title: 재현 가능하다는 말은 무엇을 증명하는가
summary: 목록에 뜨는 한 줄
date: 2026-07-14
tags: [MLOps, 재현성]
series: proving-runs   # 시리즈에 넣을 때만. src/content/series 의 파일명과 같아야 한다
part: 1
draft: false
```

시리즈를 새로 만들려면 `src/content/series/<슬러그>.md` 에 `title`, `summary`, `status`, `order` 만 적는다.

## 어디를 고치나

| 대상 | 파일 |
| --- | --- |
| 이름·직함·링크·네비 | `src/site.ts` |
| note status 정의 | `src/lib/taxonomy.ts` |
| 색·폰트·간격 토큰 | `src/styles/global.css` 상단 |
| 자기소개·Focus·Experience | `src/pages/portfolio/index.astro` |
| 배포 경로 | `astro.config.mjs` 의 `BASE` |

## 배포

`gh-pages` 브랜치에 빌드 결과를 올린다.

```bash
npm run build && touch dist/.nojekyll && git -C dist add -A && git -C dist commit -m deploy && git -C dist push -f origin gh-pages
```

`astro.config.mjs` 의 `BASE` 를 바꾸면 코드 링크와 마크다운 본문 링크가 전부 따라온다.
마크다운 링크는 `prefixInternalLinks` hast 플러그인이 처리한다.

## 남은 자리표시자

- `src/site.ts` 의 LinkedIn URL, Email
- `src/pages/portfolio/index.astro` 의 `experience` 연도
