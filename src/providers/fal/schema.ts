import { z } from "zod";
import { ImageJobSchema } from "~/jobs/image";

export type FalImage = {
  url: string;
  width: number;
  height: number;
  contentType: string;
};

export const FalBaseJobSchema = z.object({
  provider: z.literal("fal"),
});

export const FalImageJobSchema = ImageJobSchema.extend(FalBaseJobSchema);
export type FalImageJob = z.infer<typeof FalImageJobSchema>;

export const FalJobSchema = z.discriminatedUnion("type", [FalImageJobSchema]);
export type FalJob = z.infer<typeof FalJobSchema>;
