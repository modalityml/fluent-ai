import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { version } from "../../package.json";

export const providerSchema = z.enum([
  "anthropic",
  "fal",
  "fireworks",
  "google",
  "ollama",
  "openai",
  "perplexity",
  "voyageai",
]);

const optionsSchema = z.object({
  apiKey: z.string().optional(),
  baseURL: z.string().optional(),
});

const baseJobSchema = z.object({
  version: z.string().optional(),
  options: optionsSchema.optional(),
});

const messageContentSchema = z.union([
  z.string(),
  z.array(
    z.object({
      type: z.literal("text"),
      text: z.string(),
    })
  ),
  z.array(
    z.object({
      type: z.literal("image"),
      image_url: z.string().optional(),
      source: z
        .object({
          type: z.literal("base64"),
          data: z.string(),
          media_type: z.enum([
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ]),
        })
        .optional(),
    })
  ),
]);

const messageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: messageContentSchema,
});

const streamOptionsSchema = z.object({
  includeUsage: z.boolean().optional(),
});

const responseFormatSchema = z.object({
  type: z.enum(["json_object", "json_schema"]),
  json_schema: z.any().optional(),
});

const chatToolSchema = z.object({
  params: z.object({
    name: z.string(),
    description: z.string().optional(),
    parameters: z.any().optional(),
  }),
});

const jsonSchemaDefSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  schema: z.any(),
});

const chatJobParamsSchema = z.object({
  temperature: z.number().optional(),
  stream: z.boolean().optional(),
  streamOptions: streamOptionsSchema.optional(),
  maxTokens: z.number().optional(),
  messages: z.array(messageSchema),
  tools: z.array(chatToolSchema).optional(),
  toolChoice: z.string().optional(),
  responseFormat: responseFormatSchema.optional(),
  topP: z.number().optional(),
  topK: z.number().optional(),
  systemPrompt: z.string().optional(),
  jsonSchema: jsonSchemaDefSchema.optional(),
});

export const chatResultSchema = z.object({
  message: z.object({
    role: z.literal("assistant"),
    content: z.string().nullable(),
  }),
  usage: z
    .object({
      prompt_tokens: z.number(),
      completion_tokens: z.number(),
      total_tokens: z.number(),
    })
    .optional(),
  tool_calls: z
    .array(
      z.object({
        name: z.string(),
        arguments: z.record(z.any()),
      })
    )
    .optional(),
});

const chatJobSchema = baseJobSchema.extend({
  type: z.literal("chat"),
  model: z.string(),
  params: chatJobParamsSchema,
  result: chatResultSchema.optional(),
});

const embeddedJobParamsSchema = z.object({
  input: z.string().optional(),
  dimensions: z.number().optional(),
  encodingFormat: z.string().optional(),
});

const embeddingResultSchema = z.object({
  embedding: z.array(z.number()),
  usage: z
    .object({
      prompt_tokens: z.number(),
      total_tokens: z.number(),
    })
    .optional(),
});

const embeddingJobSchema = baseJobSchema.extend({
  type: z.literal("embedding"),
  model: z.string(),
  params: embeddedJobParamsSchema,
  result: embeddingResultSchema.optional(),
});

const imageSizeSchema = z.union([
  z.literal("square_hd"),
  z.literal("square"),
  z.literal("portrait_4_3"),
  z.literal("portrait_16_9"),
  z.literal("landscape_4_3"),
  z.literal("landscape_16_9"),
  z.object({
    width: z.number(),
    height: z.number(),
  }),
]);

const imageJobParamsSchema = z.object({
  prompt: z.string().optional(),
  n: z.number().optional(),
  quality: z.string().optional(),
  responseFormat: z.string().optional(),
  size: imageSizeSchema.optional(),
  style: z.string().optional(),
  user: z.string().optional(),
  numInferenceSteps: z.number().optional(),
  seed: z.number().optional(),
  guidanceScale: z.number().optional(),
  syncMode: z.boolean().optional(),
  enableSafetyChecker: z.boolean().optional(),
});

const imageResultSchema = z.object({
  images: z.array(
    z.union([
      z.object({
        url: z.string(),
      }),
      z.object({
        base64: z.string(),
      }),
    ])
  ),
  metadata: z
    .object({
      prompt: z.string(),
      size: imageSizeSchema,
      seed: z.number().optional(),
    })
    .optional(),
});

const imageJobSchema = baseJobSchema.extend({
  type: z.literal("image"),
  model: z.string(),
  params: imageJobParamsSchema,
  result: imageResultSchema.optional(),
});

const modelsJobSchema = baseJobSchema.extend({ type: z.literal("models") });
const modelJobSchema = baseJobSchema.extend({ type: z.literal("model") });

const anthropicJobSchema = z
  .object({
    provider: z.literal("anthropic"),
  })
  .and(z.discriminatedUnion("type", [chatJobSchema, modelsJobSchema]));

const falJobSchema = z
  .object({
    provider: z.literal("fal"),
  })
  .and(z.discriminatedUnion("type", [imageJobSchema]));

const googleJobSchema = z
  .object({
    provider: z.literal("google"),
  })
  .and(z.discriminatedUnion("type", [chatJobSchema]));

const ollamaJobSchema = z
  .object({
    provider: z.literal("ollama"),
  })
  .and(
    z.discriminatedUnion("type", [
      chatJobSchema,
      embeddingJobSchema,
      modelsJobSchema,
      modelJobSchema,
    ])
  );

const openaiJobSchema = z
  .object({
    provider: z.literal("openai"),
  })
  .and(
    z.discriminatedUnion("type", [
      chatJobSchema,
      embeddingJobSchema,
      imageJobSchema,
      modelsJobSchema,
    ])
  );

const voyageaiJobSchema = z
  .object({
    provider: z.literal("voyageai"),
  })
  .and(z.discriminatedUnion("type", [embeddingJobSchema]));

export const jobSchema = z.union([
  anthropicJobSchema,
  falJobSchema,
  googleJobSchema,
  ollamaJobSchema,
  openaiJobSchema,
  voyageaiJobSchema,
]);

export class Job {
  provider!: z.infer<typeof providerSchema>;
  options!: z.infer<typeof optionsSchema>;
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

export const jsonSchema = zodToJsonSchema(jobSchema);
export type AIProviderOptions = z.infer<typeof optionsSchema>;
export type ChatJobParams = z.infer<typeof chatJobParamsSchema>;
export type EmbeddingJobParams = z.infer<typeof embeddedJobParamsSchema>;
export type ImageSize = z.infer<typeof imageSizeSchema>;
export type ImageJobParams = z.infer<typeof imageJobParamsSchema>;
export type AIJob = z.infer<typeof jobSchema>;
