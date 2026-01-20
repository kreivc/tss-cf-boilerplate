import { env } from "cloudflare:workers";
import z from "zod";
import { protectedProcedure } from "../index";

export const mediaRouter = {
  listMedia: protectedProcedure
    .input(
      z
        .object({
          prefix: z.string().optional(),
          maxKeys: z.number().min(1).max(100).default(50),
          cursor: z.string().optional(),
        })
        .optional()
    )
    .handler(async ({ input }) => {
      try {
        const prefix = input?.prefix ?? "media/";
        const maxKeys = input?.maxKeys ?? 50;
        const baseUrl = env.R2_CDN_URL;

        const listResult = await env.BUCKET.list({
          prefix,
          limit: maxKeys,
          cursor: input?.cursor,
        });

        const items = listResult.objects.map((item) => ({
          key: item.key,
          url: baseUrl ? `${baseUrl}/${item.key}` : item.key,
          size: item.size,
          lastModified: item.uploaded?.toISOString() ?? null,
        }));

        return {
          items,
          nextCursor: listResult.truncated ? listResult.cursor : undefined,
          isTruncated: listResult.truncated,
        };
      } catch (error) {
        console.error("listMedia error:", error);
        throw error;
      }
    }),

  deleteMedia: protectedProcedure
    .input(z.object({ key: z.string().min(1) }))
    .handler(async ({ input }) => {
      try {
        const { key } = input;
        await env.BUCKET.delete(key);
        return { success: true, key };
      } catch (error) {
        console.error("deleteMedia error:", error);
        throw error;
      }
    }),
};
