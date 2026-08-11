/**
 * Note status: 이 노트를 얼마나 믿어도 되는가.
 * rough 를 1급으로 두는 이유는, 정리된 것만 올리려 하면 아무것도 안 올라오기 때문이다.
 * Writing 에는 이 축이 없다. 글은 한 번 쓰고 발행하는 것이고, 노트는 계속 고치는 것이다.
 */
export const NOTE_STATUS = ['rough', 'verified', 'overturned'] as const;
export type NoteStatus = (typeof NOTE_STATUS)[number];

export const NOTE_STATUS_NOTE: Record<NoteStatus, string> = {
  rough: '아직 정리 안 됨. 그때의 기록 그대로',
  verified: '직접 확인함',
  overturned: '나중에 틀린 걸 알게 됨. 왜 틀렸는지는 본문에',
};
