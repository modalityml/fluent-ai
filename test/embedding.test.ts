import { test, expect } from "bun:test";
import { openai, ollama, voyageai, requestObject, load } from "../src";

function createJobs() {
  return [
    ollama().embedding("nomic-embed-text"),
    openai({ apiKey: "<key>" }).embedding("text-embedding-ada-002"),
    voyageai({ apiKey: "<key>" }).embedding("voyage-3-lite"),
  ];
}

test("embeddings", async () => {
  const jobs = createJobs();
  for (const job of jobs) {
    expect(
      await requestObject(job.input("hi").makeRequest())
    ).toMatchSnapshot();
  }
});

test("dump", () => {
  const jobs = createJobs();
  for (const job of jobs) {
    expect(job.dump()).toMatchSnapshot();
  }
});

test("load", async () => {
  const jobs = createJobs();
  for (const job of jobs) {
    const req1 = await requestObject(load(job.dump()).makeRequest!());
    const req2 = await requestObject(job.makeRequest());
    expect(req1).toEqual(req2);
  }
});
