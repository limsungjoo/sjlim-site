import rss from '@astrojs/rss';
import { getPosts } from '../lib/content';
import { href } from '../lib/href';
import { site } from '../site';

export async function GET(context) {
  const posts = await getPosts();
  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: href(`/writing/${post.id}/`),
      categories: post.data.tags,
    })),
    customData: '<language>ko-kr</language>',
  });
}
