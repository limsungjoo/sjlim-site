---
title: fold 루프에서 run 을 명시적으로 닫지 않으면 두 번째부터 안 올라간다
summary: 교차 검증 루프에서 fold 0 만 기록되고 나머지가 조용히 사라졌다. 학습 루프 사이에 run 종료를 직접 호출해야 한다.
created: 2026-07-16
status: verified
tags:
  - 실험 기록
  - 함정
---

fold 를 돌면서 매번 새 로거를 만들었는데, 기록에는 fold 0 만 남고 1 이후가 없었다.
에러도 경고도 없었다.

원인은 앞 fold 의 run 이 안 닫힌 상태에서 다음 로거가 붙은 것이다.
프레임워크가 학습 종료 시점에 run 을 자동으로 닫아줄 거라고 가정했는데, 루프 안에서는 그 시점이 오지 않는다.

```python
for fold in folds:
    trainer.fit(...)
    finish_run()   # 이 줄이 없으면 다음 fold 가 조용히 유실된다
```

같은 종류의 실패가 위험한 이유는 [실패 테스트가 통과해도 규칙을 지키는 건 아니다](/writing/tests-that-pass-for-nothing/) 와 같다.
아무 신호가 없으면 성공과 구분되지 않는다.
