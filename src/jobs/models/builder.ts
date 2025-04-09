import { JobBuilder } from "~/jobs/builder";
import type { ModelsJob } from "./schema";

export class ModelsJobBuilder extends JobBuilder {
  job: ModelsJob;

  constructor() {
    super();
    this.job = {
      type: "models",
    };
  }

  dump() {
    return {
      ...super.dump(),
      ...this.job,
    };
  }
}
