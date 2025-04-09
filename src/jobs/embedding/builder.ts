import { Job } from "../job";
import type { EmbeddingJob } from "./schema";

export class EmbeddingJobBuilder extends Job<EmbeddingJob> {
  job: EmbeddingJob;

  constructor(model: string) {
    super();
    this.job = {
      type: "embedding",
      model: model,
    };
  }

  input(input: string) {
    this.job.input = input;
    return this;
  }

  dimensions(dimensions: number) {
    this.job.dimensions = dimensions;
    return this;
  }

  encodingFormat(encodingFormat: string) {
    this.job.encodingFormat = encodingFormat;
    return this;
  }

  dump() {
    const obj = super.dump();
    return {
      ...obj,
      ...this.job,
    };
  }
}
