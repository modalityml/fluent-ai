import { z } from "zod";
import { ImageJobSchema } from "~/jobs";

export type FalImage = {
  url: string;
  width: number;
  height: number;
  contentType: string;
};

export const FalBaseJobSchema = z.object({
  provider: z.literal("fal"),
});

export const FalImageJobSchema = ImageJobSchema.merge(FalBaseJobSchema);
export type FalImageJob = z.infer<typeof FalImageJobSchema>;

export const FalJobSchema = z.discriminatedUnion("type", [FalImageJobSchema]);
export type FalJob = z.infer<typeof FalJobSchema>;
