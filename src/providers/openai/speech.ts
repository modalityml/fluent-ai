import { type JobOptions } from "~/jobs/schema";
import { SpeechJobBuilder } from "~/jobs/speech";
import type { OpenAISpeechJob } from "./schema";

export class OpenAISpeechJobBuilder extends SpeechJobBuilder<OpenAISpeechJob> {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "openai";
    this.options = options;
  }

  makeRequest(): Request {
    return new Request("https://api.openai.com/v1", {});
  }

  async handleResponse(response: Response) {
    const raw = await response.json();
    return { raw };
  }
}
