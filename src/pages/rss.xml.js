import rss from '@astrojs/rss';
import { getStream } from '../lib/content';
import { href } from '../lib/href';
import { site } from '../site';

// 발행일이 아니라 마지막으로 손댄 날을 pubDate 로 쓴다. 갱신이 구독자에게 보이는 편이 맞다.
export async function GET(context) {
  const stream = await getStream();
  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: stream.map(({ kind, entry, touched }) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: touched,
      link: href(`/${kind === 'note' ? 'notes' : 'decisions'}/${entry.id}/`),
      categories: [kind, entry.data.layer, ...entry.data.tags],
    })),
    customData: '<language>ko-kr</language>',
  });
}
