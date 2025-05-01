import { z } from "zod";
import { BaseJobSchema } from "~/jobs/schema";

export const SpeechInputSchema = z.object({
  model: z.string(),
});

export const SpeechOutputSchema = z.object({});

export const SpeechJobSchema = BaseJobSchema.extend({
  type: z.literal("speech"),
  input: SpeechInputSchema,
  output: SpeechOutputSchema.optional(),
});

export type SpeechJob = z.infer<typeof SpeechJobSchema>;
export type SpeechInput = z.infer<typeof SpeechInputSchema>;
export type SpeechOutput = z.infer<typeof SpeechOutputSchema>;
