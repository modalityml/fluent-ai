import { Job } from "./job";

export class EmbeddingJob extends Job {
  model: string;
  params: {
    input?: string;
    dimensions?: number;
    encodingFormat?: string;
  };

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
      type: "embedding",
      model: this.model,
      params: this.params,
    };
  }
}
