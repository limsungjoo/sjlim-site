# sjlim-site

Astro 7 + Tailwind 4 정적 사이트.

```bash
npm install
npm run dev      # http://localhost:4321/sjlim-site/
npm run build
npm run preview
```

## 이 사이트가 푸는 문제

세 가지가 섞여 있는데 요구가 서로 다르다.

| | 쓰는 빈도 | 시간이 지나면 |
| --- | --- | --- |
| 알게 된 정보 | 높음 | 갱신됨 |
| 고민한 것 | 낮음 | 뒤집힘 |
| 자기 기록 | 매일 | 남아 있기만 하면 됨 |

블로그는 append-only 라 셋 다 안 맞는다.
그래서 **발행일이 아니라 마지막으로 손댄 날**을 축으로 쓴다.

## 구조

```
/             최근 고친 순 통합 스트림
/notes/       알게 된 정보. layer 별로 묶임
/decisions/   고민하고 고른 것
/portfolio/   만든 것
```

### 두 축

| 축 | 값 | 정의 위치 |
| --- | --- | --- |
| `layer` | `model` `agent` `infra` `control` | `src/lib/taxonomy.ts` |
| note `status` | `rough` `verified` `overturned` | 〃 |
| decision `status` | `active` `revisit` `superseded` | 〃 |

태그는 자유롭게 늘어나 관리가 안 되지만 layer 는 넷으로 고정이라 안 무너진다.
`tags` 는 보조 표시일 뿐 네비게이션이 아니다.

### status 를 두는 이유

정리된 것만 올리려 하면 아무것도 안 올라온다.
`rough` 를 1급으로 두어 "아직 정리 안 됨" 상태로 공개할 수 있게 한다.

틀린 걸 알게 되면 지우지 않고 `overturned` 로 바꾸고 본문에 왜 틀렸는지 적는다.
이 기록이 남의 블로그에 없는 부분이다.

정말 남에게 안 보일 것은 `draft: true`.
프로덕션 빌드에서 빠지고 `npm run dev` 에서만 보인다.

## 쓰기

```bash
npm run new -- note infra "aws CLI 빈 prefix 함정"
npm run new -- decision control "배치 소유권" --draft
```

frontmatter 가 채워진 파일이 생긴다.
decision 은 본문 4칸(맥락 / 선택지 / 고른 것 / 버린 것)까지 미리 들어간다.

한글 제목은 슬러그를 못 만들어 `decision-<날짜>.md` 로 떨어진다. 파일명만 고치면 된다.

### note frontmatter

```yaml
title: aws CLI 는 빈 prefix 에서 KeyCount 를 안 준다
summary: 목록과 스트림에 뜨는 한 줄
created: 2026-08-04
updated: 2026-08-11   # 고쳤을 때만. 목록에 * 로 표시된다
layer: infra
status: verified      # rough | verified | overturned
tags: [aws, s3, 함정]
draft: false
```

### decision frontmatter

```yaml
title: 목록을 도는 책임은 한 층만 갖는다
summary: 한 줄
decided: 2026-08-05
updated: 2026-08-11
layer: control
status: active                    # active | revisit | superseded
supersedes: 이전-결정-슬러그        # 대체했을 때만
tags: [설계, 오너십]
```

`supersedes` 를 적으면 양쪽 문서에 서로를 가리키는 링크가 자동으로 붙는다.

## 어디를 고치나

| 대상 | 파일 |
| --- | --- |
| 이름·직함·링크·네비 | `src/site.ts` |
| layer·status 정의 | `src/lib/taxonomy.ts` |
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
