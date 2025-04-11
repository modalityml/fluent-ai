import type { z } from "zod";
import { JobBuilder } from "~/jobs/builder";
import type { ModelsJobSchema } from "./schema";

type ModelsJob = z.infer<typeof ModelsJobSchema>;

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
