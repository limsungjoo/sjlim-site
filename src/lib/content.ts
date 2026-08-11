import { getCollection, type CollectionEntry } from 'astro:content';
import { LAYERS, type Layer } from './taxonomy';

export type Note = CollectionEntry<'notes'>;
export type Decision = CollectionEntry<'decisions'>;

/** draft 는 프로덕션 빌드에서만 제외. 로컬 dev 에서는 보인다. */
const visible = ({ data }: { data: { draft: boolean } }) =>
  import.meta.env.PROD ? !data.draft : true;

/** 노트의 축은 발행일이 아니라 마지막으로 손댄 날이다. */
export function touchedAt(entry: Note | Decision): Date {
  if ('created' in entry.data) {
    return entry.data.updated ?? entry.data.created;
  }
  return entry.data.updated ?? entry.data.decided;
}

export async function getNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', visible);
  return notes.sort((a, b) => touchedAt(b).getTime() - touchedAt(a).getTime());
}

export async function getDecisions(): Promise<Decision[]> {
  const decisions = await getCollection('decisions', visible);
  return decisions.sort((a, b) => touchedAt(b).getTime() - touchedAt(a).getTime());
}

export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export type StreamItem = {
  kind: 'note' | 'decision';
  entry: Note | Decision;
  touched: Date;
};

/** 홈에 뿌리는 통합 스트림. 새로 쓴 순서가 아니라 최근 손댄 순서다. */
export async function getStream(limit?: number): Promise<StreamItem[]> {
  const [notes, decisions] = await Promise.all([getNotes(), getDecisions()]);
  const items: StreamItem[] = [
    ...notes.map((entry) => ({ kind: 'note' as const, entry, touched: touchedAt(entry) })),
    ...decisions.map((entry) => ({ kind: 'decision' as const, entry, touched: touchedAt(entry) })),
  ].sort((a, b) => b.touched.getTime() - a.touched.getTime());
  return limit ? items.slice(0, limit) : items;
}

/** 층별로 묶는다. 비어 있는 층도 자리를 남겨 무엇이 아직 없는지 보이게 한다. */
export function groupByLayer<T extends { data: { layer: Layer } }>(
  entries: T[],
): { layer: Layer; entries: T[] }[] {
  return LAYERS.map((layer) => ({
    layer,
    entries: entries.filter((e) => e.data.layer === layer),
  }));
}

/** supersedes 로 이 결정을 대체한 쪽을 찾는다. */
export function findSupersededBy(all: Decision[], slug: string): Decision | undefined {
  return all.find((d) => d.data.supersedes === slug);
}
