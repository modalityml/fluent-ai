import { Job } from "./job";

export class EmbeddingJob extends Job {
  params: {
    input?: string;
    dimensions?: number;
    encodingFormat?: string;
  };

  constructor() {
    super();
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
    return { ...obj, embedding: { model: this.model, params: this.params } };
  }
}
