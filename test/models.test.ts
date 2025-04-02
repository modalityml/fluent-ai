import { test, expect } from "bun:test";
import { openai, ollama, anthropic, requestObject, load } from "../src";

const jobs = [
  ollama().models(),
  openai({ apiKey: "<key>" }).models(),
  anthropic({ apiKey: "<key>" }).models(),
];

test("models", async () => {
  for (const job of jobs) {
    expect(await requestObject(job.makeRequest())).toMatchSnapshot();
  }
});

test("dump", () => {
  for (const job of jobs) {
    expect(job.dump()).toMatchSnapshot();
  }
});

test("load", async () => {
  for (const job of jobs) {
    const req1 = await requestObject(load(job.dump()).makeRequest!());
    const req2 = await requestObject(job.makeRequest());
    expect(req1).toEqual(req2);
  }
});
