import { z } from "zod";

export const CreateContactInput = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  question: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .max(2000),
});
export type CreateContactInput = z.infer<typeof CreateContactInput>;
