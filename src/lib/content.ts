import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'writing'>;
export type Series = CollectionEntry<'series'>;

/** 최신순. draft 는 프로덕션 빌드에서만 제외한다. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('writing', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

/** 시리즈 하나와 거기 속한 글을 편 번호 순으로 묶는다. */
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
