import { z } from "zod";

// Game Categories
export const GameCategory = z.enum([
  "MOBA",
  "RPG",
  "FPS",
  "Battle Royale",
  "Sports",
  "Racing",
  "Puzzle",
  "Card",
  "Other",
]);
export type GameCategory = z.infer<typeof GameCategory>;

// Item Categories
export const ItemCategory = z.enum([
  "Diamond",
  "Coins",
  "Gems",
  "Voucher",
  "Subscription",
  "Bundle",
  "Skin",
  "Character",
  "Other",
]);
export type ItemCategory = z.infer<typeof ItemCategory>;

// Supported Countries for pricing
export const SupportedCountry = z.enum(["ID", "US", "MY", "SG", "PH"]);
export type SupportedCountry = z.infer<typeof SupportedCountry>;

// Currency symbols by country
export const CurrencyByCountry: Record<SupportedCountry, string> = {
  ID: "Rp",
  US: "$",
  MY: "RM",
  SG: "S$",
  PH: "₱",
};

// Game Input Schemas
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

// Item Detail (Pricing) Input Schema
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
