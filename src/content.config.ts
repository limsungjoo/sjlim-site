import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { NOTE_STATUS } from './lib/taxonomy';

/** writing: 긴 글. 한 번 쓰고 발행하므로 축은 발행일이다. */
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

/**
 * notes: 짧은 노트. 계속 고쳐 쓰는 문서라 축이 updated 다.
 * draft: true 는 나만 보는 기록. 프로덕션 빌드에서 빠지고 로컬에서만 보인다.
 */
const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    status: z.enum(NOTE_STATUS).default('rough'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/** series: 목차 칸은 없고 글에 붙는 라벨로만 쓴다. 제목과 소개만 있으면 된다. */
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
    link: z.string().url().optional(),
    order: z.number().int(),
  }),
});

export const collections = { writing, notes, series, projects };
