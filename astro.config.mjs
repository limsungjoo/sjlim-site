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

// 서브경로 배포. 여기만 바꾸면 코드·마크다운 링크가 전부 따라온다.
const BASE = '/sjlim-site';

/**
 * 마크다운 본문의 '/notes/...' 같은 내부 링크에 base 를 붙인다.
 * 본문에 base 를 직접 적으면 배포 경로가 바뀔 때 전부 깨진다.
 */
const prefixInternalLinks = {
  name: 'prefix-internal-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const h = node.properties?.href;
      if (typeof h !== 'string') return;
      if (!h.startsWith('/') || h.startsWith('//') || h.startsWith(`${BASE}/`)) return;
      ctx.setProperty(node, 'href', `${BASE}${h}`);
    },
  },
};

// 배포 도메인이 정해지면 site 만 바꾸면 RSS·sitemap·canonical 이 따라간다.
export default defineConfig({
  site: 'https://limsungjoo.github.io',
  base: BASE,
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: { plugins: [tailwind()] },
  markdown: {
    processor: satteri({ hastPlugins: [wrapTables, prefixInternalLinks] }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: true,
    },
  },
});
