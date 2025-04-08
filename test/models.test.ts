import { test, expect } from "bun:test";
import { openai, ollama, anthropic, requestObject, load } from "../src";

function createJobs() {
  return [
    ollama().models(),
    openai({ apiKey: "<key>" }).models(),
    anthropic({ apiKey: "<key>" }).models(),
  ];
}

test("models", async () => {
  const jobs = createJobs();
  for (const job of jobs) {
    expect(await requestObject(job.makeRequest())).toMatchSnapshot();
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
