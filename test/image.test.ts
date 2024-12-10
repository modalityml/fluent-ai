import { test, expect } from "bun:test";
import { openai, fal, requestObject } from "../src";

const jobs = [
  openai({ apiKey: "<key>" }).image("dall-e-2"),
  fal({ apiKey: "<key>" }).image("fal-ai/flux/dev"),
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
