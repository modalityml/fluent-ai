import { z } from "zod";
import type { JobOptions } from "~/jobs/schema";
import { SpeechJobBuilder, SpeechJobSchema } from "~/jobs/speech";

export function elevenlabs(options?: JobOptions) {
  options = options || {};
  options.apiKey = options.apiKey || process.env.ELEVENLABS_API_KEY;

  return {
    speech(model: string) {
      return new ElevenlabsSpeechJobBuilder(options, model);
    },
  };
}

class ElevenlabsSpeechJobBuilder extends SpeechJobBuilder {
  constructor(options: JobOptions, model: string) {
    super(model);
    this.provider = "elevenlabs";
    this.options = options;
  }
}

export const ElevenlabsBaseJobSchema = z.object({
  provider: z.literal("elevenlabs"),
});

export const ElevenlabsSpeechJobSchema = SpeechJobSchema.extend(
  ElevenlabsBaseJobSchema
);

export const ElevenlabsJobSchema = z.discriminatedUnion("type", [
  ElevenlabsSpeechJobSchema,
]);
