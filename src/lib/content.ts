import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'writing'>;
export type Note = CollectionEntry<'notes'>;

/** draft 는 프로덕션 빌드에서만 제외. 로컬 dev 에서는 보인다. */
const visible = ({ data }: { data: { draft: boolean } }) =>
  import.meta.env.PROD ? !data.draft : true;

/** 글의 축은 발행일. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('writing', visible);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 노트의 축은 마지막으로 손댄 날. */
export function touchedAt(note: Note): Date {
  return note.data.updated ?? note.data.created;
}

export async function getNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', visible);
  return notes.sort((a, b) => touchedAt(b).getTime() - touchedAt(a).getTime());
}

export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

/** 시리즈 하나와 거기 속한 글을 편 번호 순으로 묶는다. 목차 칸은 없고 글 페이지에서만 쓴다. */
export async function getSeriesWithPosts() {
  const [series, posts] = await Promise.all([getCollection('series'), getPosts()]);
  return series
    .sort((a, b) => a.data.order - b.data.order)
    .map((entry) => ({
      entry,
      posts: posts
        .filter((p) => p.data.series === entry.id)
        .sort((a, b) => (a.data.part ?? 0) - (b.data.part ?? 0)),
    }));
}

/** 글 목록 레일에 붙일 '시리즈명 · 02' 라벨. 단독 글이면 undefined. */
export async function makeSeriesLabeler() {
  const series = await getCollection('series');
  const titles = new Map(series.map((s) => [s.id, s.data.title]));
  return (post: Post): string | undefined => {
    if (!post.data.series) return undefined;
    const title = titles.get(post.data.series);
    if (!title) return undefined;
    const part = post.data.part;
    return part ? `${title} · ${String(part).padStart(2, '0')}` : title;
  };
}
