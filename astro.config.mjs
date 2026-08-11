import { defineConfig } from 'astro/config';
import tailwind from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';

/**
 * 마크다운 표를 가로 스크롤 컨테이너로 감싼다.
 * table 자체에 overflow 를 걸면 폭이 내용에 맞춰 줄어들어 본문보다 좁아진다.
 */
const wrapTables = {
  name: 'wrap-tables',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      const parent = ctx.parent(node);
      const cls = parent?.properties?.className;
      if (Array.isArray(cls) && cls.includes('table-wrap')) return;
      ctx.wrapNode(node, {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrap'] },
        children: [],
      });
    },
  },
};

// 배포 도메인이 정해지면 site 만 바꾸면 RSS·sitemap·canonical 이 따라간다.
export default defineConfig({
  site: 'https://limsungjoo.github.io',
  base: '/sjlim-site',
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: { plugins: [tailwind()] },
  markdown: {
    processor: satteri({ hastPlugins: [wrapTables] }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: true,
    },
  },
});
