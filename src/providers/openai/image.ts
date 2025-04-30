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

    if (this.input.image) {
      return this.makeEditRequest(baseURL);
    }

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

    const imageBlob = new Blob([this.input.image!], { type: "image/png" });
    formData.append("image[]", imageBlob, "image.png");

    if (this.input.mask) {
      const maskBlob = new Blob([this.input.mask], { type: "image/png" });
      formData.append("mask", maskBlob, "mask.png");
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
