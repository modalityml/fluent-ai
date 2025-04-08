import { Job } from "../job";
import type { EmbeddingJobParams, EmbeddingJobSchemaType } from "./schema";

export class EmbeddingJob<T extends EmbeddingJobSchemaType> extends Job<T> {
  model: string;
  params: EmbeddingJobParams;

  constructor(model: string) {
    super();
    this.model = model;
    this.params = {};
  }

  input(_input: string) {
    this.params.input = _input;
    return this;
  }

  dimensions(_dimensions: number) {
    this.params.dimensions = _dimensions;
    return this;
  }

  encodingFormat(_encodingFormat: string) {
    this.params.encodingFormat = _encodingFormat;
    return this;
  }

  dump() {
    const obj = super.dump();
    return {
      ...obj,
      type: "embedding" as const,
      model: this.model,
      params: this.params,
      provider: this.provider,
    };
  }
}
