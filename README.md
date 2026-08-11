# sjlim-site

Astro 7 + Tailwind 4 정적 사이트.
`Portfolio` / `Writing` / `Series` 세 축으로 나뉜다.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/
npm run preview
```

## 무엇을 어디서 고치나

| 고치고 싶은 것 | 파일 |
| --- | --- |
| 이름·소개·소셜 링크·네비 | `src/site.ts` |
| 색·폰트·간격 토큰 | `src/styles/global.css` 상단 `@theme` 와 `:root` |
| 배포 도메인 | `astro.config.mjs` 의 `site` |
| 자기소개 3문단·이니셜 | `src/pages/portfolio/index.astro` |
| 이력 항목 (Career) | `src/pages/portfolio/index.astro` 의 `career` 배열 |

콘텐츠는 전부 마크다운이다. 파일을 추가하면 목록·RSS·sitemap 이 따라간다.

```
src/content/
  projects/   Experience 블록 (frontmatter 만 씀, 본문 없음)
  writing/    글
  series/     시리즈 정의 (제목·소개만, 본문 없음)
```

## 페이지 구성

| 경로 | 내용 |
| --- | --- |
| `/` | Portfolio 3 + Writing 3 + Series 전체 미리보기. 히어로 없음 |
| `/portfolio/` | 이니셜 패널 + 자기소개 + facts / Experience 2열 / Career |
| `/writing/` | 글 전체 |
| `/series/` | 시리즈별 편 목록 |

## 글 하나 추가하기

`src/content/writing/<슬러그>.md` 를 만든다. 슬러그가 그대로 URL 이 된다.

```markdown
---
title: 제목
summary: 목록과 검색 결과에 뜨는 한 줄
date: 2026-08-11
tags: [MLOps, 검증]
series: proving-runs   # 시리즈에 넣을 때만. src/content/series 의 파일명과 같아야 한다
part: 4                # 시리즈 안에서의 순서
draft: false           # true 면 프로덕션 빌드에서 빠진다
---

본문. `h2` 가 자동으로 목차가 된다.
```

`series` 를 빼면 단독 글이 된다.
시리즈를 새로 만들려면 `src/content/series/<슬러그>.md` 에 `title`, `summary`, `status`, `order` 만 적으면 된다.

## 시드 콘텐츠 주의

`src/content/` 안의 글과 프로젝트는 **초안**이다.
공개 전에 확인할 것.

- `src/pages/portfolio/index.astro` 의 `career` 배열에 자리표시자(`이전 소속`, `역할을 적어주세요`)가 있다
- `src/site.ts` 의 GitHub·LinkedIn URL 이 실제 계정인지
- `astro.config.mjs` 의 `site` 가 임시값(`https://sjlim.dev`)이다

## 스택 메모

- 런타임 JS 는 테마 토글뿐이다. 나머지는 정적 HTML + CSS
- 마크다운 처리는 Astro 7 기본 프로세서(Sätteri). 표를 가로 스크롤 컨테이너로 감싸는 hast 플러그인이 `astro.config.mjs` 에 있다
- 코드 하이라이트는 Shiki 듀얼 테마. 다크 전환은 CSS 변수로 처리한다
