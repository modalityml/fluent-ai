import { z } from "zod";
import { ImageJobBuilder, ImageJobSchema } from "~/jobs/image";
import type { JobOptions } from "~/jobs/schema";

export type FalImage = {
  url: string;
  width: number;
  height: number;
  contentType: string;
};

export const BaseFalJobSchema = z.object({
  provider: z.literal("fal"),
});

export const FalImageJobSchema = ImageJobSchema.merge(BaseFalJobSchema);
export type FalImageJobSchemaType = z.infer<typeof FalImageJobSchema>;

export const FalJobSchema = z.discriminatedUnion("type", [FalImageJobSchema]);
export type FalJobSchemaType = z.infer<typeof FalJobSchema>;

export function fal(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.FAL_API_KEY;

  return {
    image(model: string) {
      return new FalImageJob(options, model);
    },
  };
}
