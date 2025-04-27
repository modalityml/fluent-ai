import { JobBuilder } from "~/jobs/builder";
import type { SpeechJob } from "./schema";

export abstract class SpeechJobBuilder<
  Job extends SpeechJob,
> extends JobBuilder<Job> {
  input: Job["input"];

  constructor(model: string) {
    super();
    this.type = "speech";
    this.input = {
      model: model,
    };
  }
}
