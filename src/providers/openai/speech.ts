import { type JobOptions } from "~/jobs/schema";
import { SpeechJobBuilder } from "~/jobs/speech";

export class OpenAISpeechJobBuilder extends SpeechJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "openai";
    this.options = options;
  }
}
