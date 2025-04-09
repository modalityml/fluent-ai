import { z } from "zod";
import { BaseJobSchema } from "./schema";
import { Job } from "./job";

export const ModelsJobSchema = BaseJobSchema.extend({
  type: z.literal("models"),
});

export type ModelsJobSchemaType = z.infer<typeof ModelsJobSchema>;

export class ListModelsJob<T extends ModelsJobSchemaType> extends Job<T> {
  constructor() {
    super();
    this.params = {};
  }

  dump() {
    const obj = super.dump();
    return {
      ...obj,
      type: "models" as const,
      params: this.params,
      provider: this.provider,
    };
  }
}
