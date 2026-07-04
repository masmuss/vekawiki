import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const wiki = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z
      .string()
      .max(160, "decription cannot exceed 160 characters for SEO")
      .optional(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    isPinned: z.boolean().default(false),
    growthStage: z
      .enum(["seedling", "budding", "evergreen"])
      .default("seedling"),
  }),
});

export const collections = {
  wiki,
};
