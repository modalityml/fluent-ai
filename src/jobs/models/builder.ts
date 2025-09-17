import { JobBuilder } from "~/jobs/builder";
import type { ModelsJob } from "./schema";

export abstract class ModelsJobBuilder<
  Job extends ModelsJob,
> extends JobBuilder<Job> {
  input: Job["input"];

  constructor() {
    super();
    this.type = "models";
    this.input = {};
  }
}
