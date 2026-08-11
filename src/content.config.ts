import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { LAYERS, NOTE_STATUS, DECISION_STATUS } from './lib/taxonomy';

/**
 * notes: 알게 된 것. 계속 고쳐 쓰는 문서라 발행일이 아니라 updated 가 축이다.
 * draft: true 는 나만 보는 기록. 프로덕션 빌드에서 빠지고 로컬에서만 보인다.
 */
const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    layer: z.enum(LAYERS),
    status: z.enum(NOTE_STATUS).default('rough'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/**
 * decisions: 고민하고 고른 것. 뒤집히면 새 문서를 쓰지 않고 이 문서를 고친다.
 * supersedes 로 어떤 결정을 대체했는지 남긴다.
 */
const decisions = defineCollection({
  loader: glob({ base: './src/content/decisions', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    decided: z.coerce.date(),
    updated: z.coerce.date().optional(),
    layer: z.enum(LAYERS),
    status: z.enum(DECISION_STATUS).default('active'),
    /** 이 결정이 대체한 이전 결정의 슬러그 */
    supersedes: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
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

export const collections = { notes, decisions, projects };
