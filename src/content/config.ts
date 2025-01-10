// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const productsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    price: z.number(),
    price_1: z.number(),
    price_2: z.number(),
    price_3: z.number(),
    oldPrice: z.number().optional(),
    productImages: z.array(z.string()),
    descriptionParagraphs: z.array(z.string()).optional(),
    instructions: z.union([z.string(), z.array(z.string())]).optional(),
    shipping: z.union([z.string(), z.array(z.string())]).optional(),
    warranty: z.union([z.string(), z.array(z.string())]).optional(),
    reviews: z.array(
      z.object({
        name: z.string(),
        date: z.string(),
        rating: z.number().min(1).max(5),
        text: z.string(),
      })
    ).optional()
  }),
  // Excluir los productos en la carpeta unavailable
  entryGlobs: ['*.md', '!unavailable/**/*.md']
});

export const collections = {
  products: productsCollection,
};
