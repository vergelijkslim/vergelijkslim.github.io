import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  niche: z.enum(['woningverbetering']),
  type: z.enum(['vergelijking', 'review', 'gids', 'regionaal']),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('Redactie Vergelijk Uw Renovatie'),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  affiliateLinks: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  faq: z
    .array(z.object({ question: z.string(), answer: z.string() }))
    .default([]),
  relatedArticles: z.array(z.string()).default([]),
  changelog: z
    .array(z.object({ date: z.coerce.date(), note: z.string() }))
    .default([]),
  city: z.string().optional(),
  province: z.string().optional(),
});

const woningverbetering = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/woningverbetering' }),
  schema: articleSchema,
});

export const collections = { woningverbetering };
