import { z } from "zod";

export function workflow(name: string) {
  return new Workflow(name);
}

class Workflow {
  name: string;
  _input?: z.ZodType;
  steps: any[] = [];

  constructor(name: string) {
    this.name = name;
  }

  input(inputSchema: z.ZodType) {
    this._input = inputSchema;
    return this;
  }

  async run() {}

  step(name: string, fn: any) {
    return this;
  }

  dump() {}
}
