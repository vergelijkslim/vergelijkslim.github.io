import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  niche: z.enum(['zonnepanelen', 'hosting', 'woningverbetering']),
  type: z.enum(['vergelijking', 'review', 'gids', 'regionaal']),
  publishDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  author: z.string().default('Redactie VergelijkSlim'),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  affiliateLinks: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  faq: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .default([]),
  relatedArticles: z.array(z.string()).default([]),
  city: z.string().optional(),
  province: z.string().optional(),
});

const zonnepanelen = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/zonnepanelen' }),
  schema: articleSchema,
});

const hosting = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hosting' }),
  schema: articleSchema,
});

const woningverbetering = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/woningverbetering' }),
  schema: articleSchema,
});

export const collections = { zonnepanelen, hosting, woningverbetering };
