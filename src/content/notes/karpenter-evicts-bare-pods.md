---
title: Karpenter consolidation 은 단독 파드를 그냥 걷어간다
summary: 컨트롤러가 관리하지 않는 파드는 "옮길 곳 없는 파드"로 보여서 노드 정리 때 같이 사라진다.
created: 2026-06-24
updated: 2026-07-08
status: verified
tags:
  - Kubernetes
  - Karpenter
  - 함정
---

워크스페이스를 `kubernetes_pod` 로 단독 생성했더니, Karpenter 가 노드를 정리하면서 아직 쓰고 있는 워크스페이스까지 걷어갔다.

정리기 입장에서는 소유 컨트롤러가 없는 파드라 옮길 곳이 없다고 판단한다.
그래서 대기하지 않고 그냥 지운다.

대응:

- 파드를 직접 만들지 말고 Deployment 나 StatefulSet 아래에 둔다
- PodDisruptionBudget 을 붙여서 최소 가용 수를 명시한다

자동 정리를 쓸 때는 **정리 대상에서 빠지는 방법이 먼저 있어야 한다.**
정리 기능을 켜는 것보다 예외를 만드는 쪽이 오래 걸린다.
