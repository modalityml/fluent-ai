import { z } from "zod";
import { ImageJobBuilder, ImageJobSchema } from "~/jobs/image";
import type { JobOptions } from "~/jobs/schema";

export const LumaBaseJobSchema = z.object({
  provider: z.literal("luma"),
});

export const LumaImageJobSchema = ImageJobSchema.extend(LumaBaseJobSchema);

export const LumaJobSchema = z.discriminatedUnion("type", [LumaImageJobSchema]);
export type LumaJob = z.infer<typeof LumaJobSchema>;

export function luma(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.LUMA_API_KEY;

  if (!options.apiKey) {
    throw new Error("Luma API key is required");
  }

  return {
    image(model: string) {
      return new LumaImageJobBuilder(options, model);
    },
  };
}

export class LumaImageJobBuilder extends ImageJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "luma";
    this.options = options;
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
        prompt: this.input.prompt,
      }),
    });
  };
}
