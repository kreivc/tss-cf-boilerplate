import { z } from "zod";
import { GameCategory, ItemCategory, SupportedCountry } from "./schema";

export const CreateGameInput = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  category: GameCategory,
  logo: z.string().url().optional().or(z.literal("")),
  banner: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});
export type CreateGameInput = z.infer<typeof CreateGameInput>;

export const UpdateGameInput = CreateGameInput.partial().extend({
  id: z.string(),
});
export type UpdateGameInput = z.infer<typeof UpdateGameInput>;

export const ItemDetailInput = z.object({
  countryCode: SupportedCountry,
  symbol: z.string().min(1),
  price: z.number().positive("Price must be positive"),
});
export type ItemDetailInput = z.infer<typeof ItemDetailInput>;

// Item Input Schemas
export const CreateItemInput = z.object({
  gameId: z.string(),
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
  category: ItemCategory,
  logo: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().default(true),
  details: z.array(ItemDetailInput).min(1, "At least one pricing is required"),
});
export type CreateItemInput = z.infer<typeof CreateItemInput>;

export const UpdateItemInput = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only")
    .optional(),
  category: ItemCategory.optional(),
  logo: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
  details: z.array(ItemDetailInput).optional(),
});
export type UpdateItemInput = z.infer<typeof UpdateItemInput>;

// Pagination
export const PaginationInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});
export type PaginationInput = z.infer<typeof PaginationInput>;
