import { test, expect } from "bun:test";
import {
  load,
  openai,
  OpenAIChatJob,
  OpenAIEmbeddingJob,
  OpenAIImageJob,
  userPrompt,
} from "../src";

test("load chat job", async () => {
  const job1 = openai({ apiKey: "<key>" })
    .chat("gpt-4o-mini")
    .messages([userPrompt("hello")])
    .temperature(0.5);

  const job2 = load({
    provider: "openai",
    options: { apiKey: "<key>" },
    chat: {
      model: "gpt-4o-mini",
      params: {
        messages: [{ role: "user", content: ["hello"] }],
        temperature: 0.5,
      },
    },
  });

  expect(job2).toBeInstanceOf(OpenAIChatJob);
  expect(await job2.dump()).toEqual(await job1.dump());
});

test("load image job", async () => {
  const job1 = openai({ apiKey: "<key>" }).image("dalle-2").prompt("a cat");

  const job2 = load({
    provider: "openai",
    options: { apiKey: "<key>" },
    image: {
      model: "dalle-2",
      params: {
        prompt: "a cat",
      },
    },
  });

  expect(job2).toBeInstanceOf(OpenAIImageJob);
  expect(await job2.dump()).toEqual(await job1.dump());
});

test("load embedding job", async () => {
  const job1 = openai({ apiKey: "<key>" })
    .embedding("text-embedding-3-small")
    .input("hello");

  const job2 = load({
    provider: "openai",
    options: { apiKey: "<key>" },
    embedding: {
      model: "text-embedding-3-small",
      params: {
        input: "hello",
      },
    },
  });

  expect(job2).toBeInstanceOf(OpenAIEmbeddingJob);
  expect(await job2.dump()).toEqual(await job1.dump());
});
