import type { JobType, Options, ProviderName } from "~/src/job/schema";
import { BaseChatBuilder, type ChatBuilder } from "~/src/builder/chat";
import {
  BaseEmbeddingBuilder,
  type EmbeddingBuilder,
} from "~/src/builder/embedding";
import { BaseImageBuilder, type ImageBuilder } from "~/src/builder/image";
import { BaseModelsBuilder, type ModelsBuilder } from "~/src/builder/models";
import { BaseSpeechBuilder, type SpeechBuilder } from "~/src/builder/speech";

const providerConfig = {
  anthropic: ["chat", "models"],
  deepseek: ["chat", "models"],
  elevenlabs: ["speech"],
  fal: ["image"],
  google: ["chat"],
  luma: ["image"],
  ollama: ["chat", "embedding", "models"],
  openai: ["chat", "embedding", "image", "models", "speech"],
  openrouter: ["chat"],
  voyage: ["embedding"],
} as const;

const builderMap = {
  chat: BaseChatBuilder,
  embedding: BaseEmbeddingBuilder,
  image: BaseImageBuilder,
  models: BaseModelsBuilder,
  speech: BaseSpeechBuilder,
};

type ProviderMethods<T extends readonly JobType[]> = {
  [K in T[number]]: K extends "chat"
    ? () => ChatBuilder
    : K extends "embedding"
      ? () => EmbeddingBuilder
      : K extends "image"
        ? () => ImageBuilder
        : K extends "models"
          ? () => ModelsBuilder
          : K extends "speech"
            ? () => SpeechBuilder
            : never;
};

function createProviderClass<T extends readonly JobType[]>(
  providerName: ProviderName,
  supportedJobTypes: T,
): new (options?: Options, version?: string) => ProviderMethods<T> {
  class DynamicProvider {
    constructor(
      public options?: Options,
      public version?: string,
    ) {}
  }

  // Add methods for each supported job type
  for (const jobType of supportedJobTypes) {
    const BuilderClass = builderMap[jobType as JobType];
    (DynamicProvider.prototype as any)[jobType] = function (
      this: DynamicProvider,
    ) {
      return new BuilderClass(providerName, this.options, this.version);
    };
  }

  return DynamicProvider as any;
}

const OpenAIProvider = createProviderClass("openai", providerConfig.openai);
const AnthropicProvider = createProviderClass(
  "anthropic",
  providerConfig.anthropic,
);
const DeepSeekProvider = createProviderClass(
  "deepseek",
  providerConfig.deepseek,
);
const ElevenLabsProvider = createProviderClass(
  "elevenlabs",
  providerConfig.elevenlabs,
);
const FalProvider = createProviderClass("fal", providerConfig.fal);
const GoogleProvider = createProviderClass("google", providerConfig.google);
const LumaProvider = createProviderClass("luma", providerConfig.luma);
const OllamaProvider = createProviderClass("ollama", providerConfig.ollama);
const OpenRouterProvider = createProviderClass(
  "openrouter",
  providerConfig.openrouter,
);
const VoyageProvider = createProviderClass("voyage", providerConfig.voyage);

export function openai(options?: Options, version?: string) {
  return new OpenAIProvider(options, version);
}

export function anthropic(options?: Options, version?: string) {
  return new AnthropicProvider(options, version);
}

export function deepseek(options?: Options, version?: string) {
  return new DeepSeekProvider(options, version);
}

export function elevenlabs(options?: Options, version?: string) {
  return new ElevenLabsProvider(options, version);
}

export function fal(options?: Options, version?: string) {
  return new FalProvider(options, version);
}

export function google(options?: Options, version?: string) {
  return new GoogleProvider(options, version);
}

export function luma(options?: Options, version?: string) {
  return new LumaProvider(options, version);
}

export function ollama(options?: Options, version?: string) {
  return new OllamaProvider(options, version);
}

export function openrouter(options?: Options, version?: string) {
  return new OpenRouterProvider(options, version);
}

export function voyage(options?: Options, version?: string) {
  return new VoyageProvider(options, version);
}
