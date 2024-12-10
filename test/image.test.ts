import { test, expect } from "bun:test";
import { openai, fal, requestObject, load } from "../src";

const jobs = [
  fal({ apiKey: "<key>" }).image("fal-ai/flux/dev"),
  openai({ apiKey: "<key>" }).image("dall-e-2"),
];

test("image", async () => {
  for (const job of jobs) {
    expect(
      await requestObject(
        job.n(3).prompt("A cute baby sea otter").makeRequest()
      )
    ).toMatchSnapshot();
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
