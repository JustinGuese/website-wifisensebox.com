import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const usecaseSchema = z.object({
  title: z.string(),
  category: z.enum(['senior-care','smart-office','smart-home','retail','industrial']),
  rank: z.number(),               
  heroTitle: z.string(),
  heroSubtitle: z.string(),
  painPoint: z.string(),          
  solution: z.string(),           
  features: z.array(z.object({ icon: z.string(), title: z.string(), body: z.string() })),
  targetBuyer: z.string(),        
  faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  ctaText: z.string().default('Join the waitlist'),
  locale: z.enum(['en','de']).default('en'),
  heroBullets: z.array(z.string()).optional(),
  heroStats: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  demoConfig: z.object({
    headerLabel: z.string().optional(),
    metricLabel: z.string().optional(),
    metricUnit: z.string().optional(),
    metricBase: z.number().optional(),
    metricMin: z.number().optional(),
    metricMax: z.number().optional(),
    metricFooter: z.string().optional(),
    statusLabel: z.string().optional(),
    statusOn: z.string().optional(),
    statusOff: z.string().optional(),
    secondaryLabel: z.string().optional(),
    privacyLabel: z.string().optional(),
    privacyText: z.string().optional(),
    ctaText: z.string().optional(),
  }).optional(),
});

const categorySchema = z.object({
  title: z.string(),
  rank: z.number(),
  tagline: z.string(),
  description: z.string(),
  locale: z.enum(['en','de']).default('en'),
});

const legalSchema = z.object({
  title: z.string(),
  locale: z.enum(['en', 'de']).default('en'),
  updated: z.string().optional(),
});

export const collections = {
  usecases: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/usecases" }),
    schema: usecaseSchema,
  }),
  categories: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/categories" }),
    schema: categorySchema,
  }),
  legal: defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/legal" }),
    schema: legalSchema,
  }),
};
