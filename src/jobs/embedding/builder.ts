import { JobBuilder } from "~/jobs/builder";
import type { EmbeddingInput, EmbeddingOutput } from "./schema";

export class EmbeddingJobBuilder extends JobBuilder<
  EmbeddingInput,
  EmbeddingOutput
> {
  input: EmbeddingInput;

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
