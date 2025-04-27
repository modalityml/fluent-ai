import type { JobOptions } from "~/jobs/schema";
import { ImageJobBuilder } from "~/jobs/image";
import { OPENAI_BASE_URL, type OpenAIImageJob } from "./schema";

export class OpenAIImageJobBuilder extends ImageJobBuilder<OpenAIImageJob> {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "openai";
    this.options = options;
  }

  makeRequest() {
    const baseURL = this.options!.baseURL || OPENAI_BASE_URL;
    const url = `${baseURL}/images/generations`;
    const body = {
      prompt: this.input.prompt,
      model: this.input.model,
      n: this.input.n,
      quality: this.input.quality,
      response_format: this.input.responseFormat,
      size: this.input.size,
      style: this.input.style,
      user: this.input.user,
    };

    console.log(url);
    console.log(JSON.stringify(body));

    return new Request(url, {
      headers: {
        Authorization: `Bearer ${this.options!.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async handleResponse(response: Response) {
    const raw = await response.json();
    // TODO: handle raw.images
    return { raw, images: raw.data.map((image: any) => image.url) };
  }
}
