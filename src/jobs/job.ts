import { z } from "zod";
import { version } from "../../package.json";

const jobProviderSchema = z.enum([
  "anthropic",
  "fal",
  "fireworks",
  "google",
  "ollama",
  "openai",
  "perplexity",
  "voyageai",
]);

const jobOptionsSchema = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
});

export type AIProviderOptions = z.infer<typeof jobOptionsSchema>;

const baseJobSchema = z.object({
  version: z.string().optional(),
  provider: jobProviderSchema,
  options: z.any().optional(),
});

const chatJobSchema = baseJobSchema.extend({
  type: z.literal("chat"),
  model: z.string(),
  params: z.any(),
});

const embeddingJobSchema = baseJobSchema.extend({
  type: z.literal("embedding"),
  model: z.string(),
  params: z.any(),
});

const imageJobSchema = baseJobSchema.extend({
  type: z.literal("image"),
  model: z.string(),
  params: z.any(),
});

const jobSchema = z.discriminatedUnion("type", [
  chatJobSchema,
  embeddingJobSchema,
  imageJobSchema,
]);

export type AIJob = z.infer<typeof jobSchema>;

export class Job {
  provider!: z.infer<typeof jobProviderSchema>;
  options!: z.infer<typeof jobOptionsSchema>;
  params: any;

  makeRequest?: () => Request;
  handleResponse?: (response: Response) => any;

  _setParams(params: any) {
    this.params = { ...this.params, ...params };
    return this;
  }

  async run() {
    const request = this.makeRequest!();
    const response = await fetch(request);
    return await this.handleResponse!(response);
  }

  dump() {
    return {
      version: version,
      provider: this.provider!,
      options: this.options,
    };
  }
}
