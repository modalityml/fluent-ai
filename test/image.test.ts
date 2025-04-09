import { test, expect } from "bun:test";
import { openai, fal, load } from "../src";
import { requestObject } from "./utils";

function createJobs() {
  // prettier-ignore
  return [
    fal({ apiKey: "<key>" }).image("fal-ai/flux/dev").n(3).prompt("A cute baby sea otter"),
    openai({ apiKey: "<key>" }).image("dall-e-2").n(3).prompt("A cute baby sea otter"),
  ];
}

test("image", async () => {
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
