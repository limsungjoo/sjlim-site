// 이 사이트의 두 축. 여기 없는 값은 스키마가 거부한다.

/**
 * Layer: AX 작업이 실제로 오가는 네 층.
 * 태그는 무한히 늘어나 관리가 안 되지만 층은 네 개로 고정이라 무너지지 않는다.
 */
export const LAYERS = ['model', 'agent', 'infra', 'control'] as const;
export type Layer = (typeof LAYERS)[number];

export const LAYER_LABEL: Record<Layer, string> = {
  model: 'Model',
  agent: 'Agent',
  infra: 'Infra',
  control: 'Control',
};

export const LAYER_NOTE: Record<Layer, string> = {
  model: '프롬프트, 툴 정의, 평가, 컨텍스트 설계',
  agent: '하네스, 실행 루프, 메모리, 서브에이전트',
  infra: 'GPU, 스케줄링, 워크스페이스, 스토리지',
  control: 'CI, 정책 게이트, 규약, 재현성',
};

/**
 * Note status: 이 노트를 얼마나 믿어도 되는가.
 * rough 를 1급으로 두는 이유는, 정리된 것만 올리려 하면 아무것도 안 올라오기 때문이다.
 */
export const NOTE_STATUS = ['rough', 'verified', 'overturned'] as const;
export type NoteStatus = (typeof NOTE_STATUS)[number];

export const NOTE_STATUS_NOTE: Record<NoteStatus, string> = {
  rough: '아직 정리 안 됨. 그때의 기록 그대로',
  verified: '직접 확인함',
  overturned: '나중에 틀린 걸 알게 됨. 왜 틀렸는지는 본문에',
};

/** Decision status: 이 결정이 지금도 유효한가. */
export const DECISION_STATUS = ['active', 'revisit', 'superseded'] as const;
export type DecisionStatus = (typeof DECISION_STATUS)[number];

export const DECISION_STATUS_NOTE: Record<DecisionStatus, string> = {
  active: '지금도 이 결정대로 간다',
  revisit: '전제가 흔들려서 다시 봐야 한다',
  superseded: '다른 결정으로 대체됐다',
};
