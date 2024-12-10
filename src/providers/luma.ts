import { ImageJob } from "../jobs/image";
import type { AIProviderOptions } from "../jobs/job";

export function luma(options?: AIProviderOptions) {
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

export class LumaImageJob extends ImageJob {
  constructor(options: AIProviderOptions, model: string) {
    super();
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
