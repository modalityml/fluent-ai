import { z } from "zod";
import { ImageJobSchema } from "~/jobs/image";

export const FalBaseJobSchema = z.object({
  provider: z.literal("fal"),
});

export const FalImageJobSchema = ImageJobSchema.extend(FalBaseJobSchema);

export const FalJobSchema = z.discriminatedUnion("type", [FalImageJobSchema]);
