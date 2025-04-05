import { jobSchema, type AIJob, type Job } from "./job";
import { openai } from "../providers/openai";
import { anthropic } from "../providers/anthropic";
import { fal } from "../providers/fal";
import { ollama } from "../providers/ollama";
import { voyageai } from "../providers/voyageai";

export function load(obj: AIJob): Job {
  obj = jobSchema.parse(obj);

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

  if (obj.type === "chat" && "chat" in provider) {
    return provider.chat(obj.model)._setParams(obj.params);
  }
  if (obj.type === "embedding" && "embedding" in provider) {
    return provider.embedding(obj.model)._setParams(obj.params);
  }
  if (obj.type === "image" && "image" in provider) {
    return provider.image(obj.model)._setParams(obj.params);
  }
  if (obj.type === "models" && "models" in provider) {
    return provider.models();
  }

  throw new Error("Failed to load job");
}
