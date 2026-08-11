---
title: aws CLI 는 빈 prefix 에서 KeyCount 를 안 준다
summary: list-objects-v2 결과의 KeyCount 로 존재 여부를 판정하면 조용히 틀린다. exit code 로 볼 것.
created: 2026-08-04
status: verified
tags:
  - aws
  - s3
  - 함정
---

S3 에 무언가 있는지 판정할 때 `list-objects-v2` 의 `KeyCount` 를 읽는 코드를 썼다.
빈 prefix 에서 이 값이 `None` 으로 나와 문자열 비교가 조용히 틀린 방향으로 떨어졌다.

존재 판정은 exit code 로 한다.

```bash
if aws s3 ls "s3://bucket/prefix/" > /dev/null 2>&1; then
  echo "있음"
fi
```

객체 하나를 확인하는 거라면 목록 조회 대신 `head-object` 를 쓴다.
목록 조회는 접근 거부와 없음을 구분하지 못한다.
같은 이유가 [기록을 믿지 않고 저장소를 본다](/writing/trust-the-store-not-the-record/) 에도 나온다.
