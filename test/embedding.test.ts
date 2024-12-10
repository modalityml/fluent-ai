import { test, expect } from "bun:test";
import { openai, ollama, voyageai, requestObject } from "../src";

const jobs = [
  openai({ apiKey: "<key>" }).embedding("text-embedding-ada-002"),
  ollama().embedding("nomic-embed-text"),
  voyageai({ apiKey: "<key>" }).embedding("voyage-3-lite"),
];

test("embeddings", async () => {
  for (const job of jobs) {
    expect(
      await requestObject(job.input("hi").makeRequest())
    ).toMatchSnapshot();
  }
});
