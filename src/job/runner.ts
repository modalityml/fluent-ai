import * as openrouter from "~/src/job/openrouter";
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
});
