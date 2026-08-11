import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ base: './src/content/writing', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    // 시리즈에 속하면 series 슬러그와 편 번호를 같이 적는다. 둘 다 없으면 단독 글.
    series: z.string().optional(),
    part: z.number().int().positive().optional(),
    draft: z.boolean().default(false),
  }),
});

const series = defineCollection({
  loader: glob({ base: './src/content/series', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    status: z.enum(['In progress', 'Complete']).default('In progress'),
    order: z.number().int().default(0),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    kind: z.string(),
    period: z.string(),
    state: z.enum(['RUNNING', 'SHIPPED', 'ARCHIVED']),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    /** 공개 저장소가 있으면 링크. 없으면 생략 */
    link: z.string().url().optional(),
    order: z.number().int(),
  }),
});

export const collections = { writing, series, projects };
