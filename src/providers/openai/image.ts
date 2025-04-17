import { ImageJobBuilder } from "~/jobs/image";
import type { JobOptions } from "~/jobs/schema";
import { OPENAI_BASE_URL } from "./schema";

export class OpenAIImageJobBuilder extends ImageJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "openai";
    this.options = options;
  }

  makeRequest = () => {
    const baseURL = this.options.baseURL || OPENAI_BASE_URL;
    return new Request(`${baseURL}/image/generations`, {
      headers: {
        Authorization: `Bearer ${this.options.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        prompt: this.job.prompt,
        model: this.job.model,
        n: this.job.n,
        quality: this.job.quality,
        response_format: this.job.responseFormat,
        size: this.job.size,
        style: this.job.style,
        user: this.job.user,
      }),
    });
  };
}
