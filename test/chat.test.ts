import { test, expect } from "bun:test";
import { openai, ollama, system, user, tool, anthropic, load } from "../src";
import { z } from "zod";
import { requestObject } from "./utils";

function createJobs() {
  return [
    anthropic({ apiKey: "<key>" }).chat("claude-3-5-sonnet-20241022"),
    ollama().chat("llama3.2"),
    openai({ apiKey: "<key>" }).chat("gpt-4o-mini"),
  ];
}

test("chat", async () => {
  for (const job of createJobs()) {
    expect(
      await requestObject(
        job
          .messages([system("you are a helpful assistant"), user("hi")])
          .temperature(0.5)
          .makeRequest(),
      ),
    ).toMatchSnapshot();
  }
});

test("stream", async () => {
  for (const job of createJobs()) {
    expect(
      await requestObject(
        job
          .messages([system("you are a helpful assistant"), user("hi")])
          .makeRequest(),
      ),
    ).toMatchSnapshot();
  }
});

test("dump", () => {
  for (const job of createJobs()) {
    expect(job.dump()).toMatchSnapshot();
  }
});

test("load", async () => {
  for (const job of createJobs()) {
    const req1 = await requestObject(load(job.dump()).makeRequest());
    const req2 = await requestObject(job.makeRequest());
    expect(req1).toEqual(req2);
  }
});

test("json_object", async () => {
  expect(
    await requestObject(
      openai({ apiKey: "<key>" })
        .chat("gpt-4o-mini")
        .messages([user("hi")])
        .responseFormat({ type: "json_object" })
        .makeRequest(),
    ),
  ).toMatchSnapshot();
});

test("tool", async () => {
  const weatherTool = tool("get_current_weather")
    .description("Get the current weather in a given location")
    .parameters(
      z.object({
        location: z.string(),
        unit: z.enum(["celsius", "fahrenheit"]).optional(),
      }),
    );

  for (const job of createJobs()) {
    expect(
      await requestObject(
        job
          .tool(weatherTool)
          .messages([user("What's the weather like in Boston today?")])
          .makeRequest(),
      ),
    ).toMatchSnapshot();
  }
});

test("jsonSchema", async () => {
  const personSchema = z.object({
    name: z.string(),
    age: z.number(),
  });

  for (const job of createJobs()) {
    expect(
      await requestObject(
        job
          .messages([
            user("generate a person with name and age in json format"),
          ])
          .jsonSchema(personSchema, "person")
          .makeRequest(),
      ),
    ).toMatchSnapshot();
  }
});
