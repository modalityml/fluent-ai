import { z } from "zod";
import { BaseJobSchema } from "~/jobs/schema";

export const ModelsJobSchema = BaseJobSchema.extend({
  type: z.literal("models"),
});

export type ModelsJob = z.infer<typeof ModelsJobSchema>;
