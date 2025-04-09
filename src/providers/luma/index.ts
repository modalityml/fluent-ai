import { ImageJobBuilder, ImageJobSchema } from "~/jobs/image";
import type { JobOptions } from "~/jobs/schema";
import { z } from "zod";

export const BaseLumaJobSchema = z.object({
  provider: z.literal("luma"),
});

export const LumaImageJobSchema = ImageJobSchema.merge(BaseLumaJobSchema);
export type LumaImageJobSchemaType = z.infer<typeof LumaImageJobSchema>;

export const LumaJobSchema = z.discriminatedUnion("type", [LumaImageJobSchema]);
export type LumaJobSchemaType = z.infer<typeof LumaJobSchema>;

export function luma(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.LUMA_API_KEY;

  if (!options.apiKey) {
    throw new Error("Luma API key is required");
  }

  return {
    image(model: string) {
      return new LumaImageJob(options, model);
    },
  };
}

export class LumaImageJob extends ImageJobBuilder<LumaImageJobSchemaType> {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.options = options;
    this.model = model;
  }

  makeRequest = () => {
    return new Request("https://api.lumalabs.ai/dream-machine/v1/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        generation_type: "image",
        prompt: this.params.prompt,
      }),
    });
  };
}
