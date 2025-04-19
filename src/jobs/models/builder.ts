import { JobBuilder } from "~/jobs/builder";
import type { ModelsInput, ModelsOutput } from "./schema";

export class ModelsJobBuilder extends JobBuilder<ModelsInput, ModelsOutput> {
  input: ModelsInput;

  constructor() {
    super();
    this.type = "models";
    this.input = {};
  }
}
