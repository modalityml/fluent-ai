import * as openrouter from "~/src/job/openrouter";
import * as openai from "~/src/job/openai";
import * as ollama from "~/src/job/ollama";
import * as voyage from "~/src/job/voyage";
import * as fal from "~/src/job/fal";
import type { Job } from "~/src/job/schema";

export class Runner {
  private runners: any;

  constructor(runners: {}) {
    this.runners = runners;
  }

  run(job: Job) {
    if (job.type === "models") {
      return this.runners[job.provider][job.type](job.options);
    }
    return this.runners[job.provider][job.type](job.input, job.options);
  }
}

export const runner = new Runner({
  openrouter: openrouter.runner,
  openai: openai.runner,
  ollama: ollama.runner,
  voyage: voyage.runner,
  fal: fal.runner,
});
