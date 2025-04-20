import { JobBuilder } from "~/jobs/builder";
import type { EmbeddingJob } from "./schema";

export abstract class EmbeddingJobBuilder<
  Job extends EmbeddingJob,
> extends JobBuilder<Job> {
  input: Job["input"];

  constructor(model: string) {
    super();
    this.type = "embedding";
    this.input = {
      model: model,
    };
  }

  value(value: string) {
    this.input.value = value;
    return this;
  }

  dimensions(dimensions: number) {
    this.input.dimensions = dimensions;
    return this;
  }

  encodingFormat(encodingFormat: string) {
    this.input.encodingFormat = encodingFormat;
    return this;
  }
}
