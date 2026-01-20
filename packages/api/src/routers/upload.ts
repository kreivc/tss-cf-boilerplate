import { env } from "cloudflare:workers";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v7 } from "uuid";
import z from "zod";
import { protectedProcedure } from "../index";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export const uploadRouter = {
  getPresignedUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        contentType: z.string(),
        folder: z.enum(["games", "items", "media"]).default("games"),
      })
    )
    .handler(async ({ input }) => {
      const { filename, contentType, folder } = input;
      const key = `${folder}/${v7()}-${filename}`;

      const putObjectCommand = new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      });

      const putUrl = await getSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 3600,
      });

      const baseUrl = env.R2_CDN_URL;
      const url = baseUrl ? `${baseUrl}/${key}` : key;

      return {
        key,
        url,
        putUrl,
      };
    }),
};
