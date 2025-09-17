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

    if (this.input.images && this.input.images.length > 0) {
      return this.makeEditRequest(baseURL);
    }

    const url = `${baseURL}/images/generations`;
    const body = {
      prompt: this.input.prompt,
      model: this.input.model,
      n: this.input.n,
      quality: this.input.quality,
      output_format: this.input.outputFormat,
      size: this.input.size,
      style: this.input.style,
      user: this.input.user,
    };

    return new Request(url, {
      headers: {
        Authorization: `Bearer ${this.options!.apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  makeEditRequest(baseURL: string) {
    const url = `${baseURL}/images/edits`;

    const formData = new FormData();
    formData.append("prompt", this.input.prompt || "");
    formData.append("model", this.input.model);

    for (const image of this.input.images!) {
      formData.append("image[]", image, image.name);
    }

    if (this.input.mask) {
      formData.append("mask", this.input.mask, "mask.png");
    }

    if (this.input.quality) {
      formData.append("quality", String(this.input.quality));
    }

    if (this.input.n) {
      formData.append("n", String(this.input.n));
    }
    if (this.input.size) {
      formData.append("size", String(this.input.size));
    }
    if (this.input.responseFormat) {
      formData.append("response_format", this.input.responseFormat);
    }
    if (this.input.user) {
      formData.append("user", this.input.user);
    }

    return new Request(url, {
      headers: {
        Authorization: `Bearer ${this.options!.apiKey}`,
      },
      method: "POST",
      body: formData,
    });
  }

  async handleResponse(response: Response) {
    const raw = await response.json();
    // TODO: handle raw.images
    return {
      raw,
      images: raw.data.map((image: any) =>
        image.url ? { url: image.url } : { base64: image.b64_json },
      ),
    };
  }
}
