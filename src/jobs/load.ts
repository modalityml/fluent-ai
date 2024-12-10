import type { AIJob, Job } from "./job";
import { openai } from "../providers/openai";
import { anthropic } from "../providers/anthropic";
import { fal } from "../providers/fal";
import { ollama } from "../providers/ollama";
import { voyageai } from "../providers/voyageai";

export function load(obj: AIJob): Job {
  let provider = null;

  if (obj.provider === "anthropic") {
    provider = anthropic(obj.options);
  } else if (obj.provider === "fal") {
    provider = fal(obj.options);
  } else if (obj.provider === "ollama") {
    provider = ollama();
  } else if (obj.provider === "openai") {
    provider = openai(obj.options);
  } else if (obj.provider === "voyageai") {
    provider = voyageai(obj.options);
  }

  if (!provider) {
    throw new Error("Unknown provider " + obj.provider);
  }

  if (obj.chat && "chat" in provider) {
    return provider.chat(obj.chat.model)._setParams(obj.chat.params);
  } else if (obj.image && "image" in provider) {
    return provider.image(obj.image.model)._setParams(obj.image.params);
  } else if (obj.embedding && "embedding" in provider) {
    return provider
      .embedding(obj.embedding.model)
      ._setParams(obj.embedding.params);
  }

  throw new Error("Failed to load job");
}
