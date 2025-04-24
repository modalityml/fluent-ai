import { z } from "zod";

export const SpeechInputSchema = z.object({
  model: z.string(),
});

export const SpeechOutputSchema = z.object({});

export const SpeechJobSchema = z.object({
  type: z.literal("speech"),
  input: SpeechInputSchema,
  output: SpeechOutputSchema.optional(),
});

export type SpeechInput = z.infer<typeof SpeechInputSchema>;
export type SpeechOutput = z.infer<typeof SpeechOutputSchema>;
