import rss from '@astrojs/rss';
import { getPosts, getNotes, touchedAt } from '../lib/content';
import { href } from '../lib/href';
import { site } from '../site';

// 글과 노트를 한 피드에. 노트는 발행일이 아니라 마지막으로 손댄 날을 쓴다.
export async function GET(context) {
  const [posts, notes] = await Promise.all([getPosts(), getNotes()]);

  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: href(`/writing/${post.id}/`),
      categories: ['writing', ...post.data.tags],
    })),
    ...notes.map((note) => ({
      title: note.data.title,
      description: note.data.summary,
      pubDate: touchedAt(note),
      link: href(`/notes/${note.id}/`),
      categories: ['note', note.data.status, ...note.data.tags],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items,
    customData: '<language>ko-kr</language>',
  });
}
