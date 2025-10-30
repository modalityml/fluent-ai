import * as openrouter from "~/src/job/openrouter";
import * as voyage from "~/src/job/voyage";
import * as fal from "~/src/job/fal";
import type { Job } from "~/src/job/schema";

export class Runner {
  private runners: any;

  constructor(runners: {}) {
    this.runners = runners;
  }

  run(job: Job) {
    return this.runners[job.provider][job.body.type](
      job.body.input,
      job.options,
    );
  }
}

export const runner = new Runner({
  openrouter: openrouter.runner,
  voyage: voyage.runner,
  fal: fal.runner,
});
