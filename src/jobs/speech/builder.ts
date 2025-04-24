import { JobBuilder } from "~/jobs/builder";
import type { SpeechInput, SpeechOutput } from "./schema";

export class SpeechJobBuilder extends JobBuilder<SpeechInput, SpeechOutput> {
  input: SpeechInput;

  constructor(model: string) {
    super();
    this.type = "speech";
    this.input = {
      model: model,
    };
  }
}
