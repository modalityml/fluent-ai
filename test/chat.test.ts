import { test, expect } from "bun:test";
import {
  openai,
  ollama,
  systemPrompt,
  userPrompt,
  tool,
  anthropic,
  load,
} from "../src";
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
          .messages([
            systemPrompt("you are a helpful assistant"),
            userPrompt("hi"),
          ])
          .temperature(0.5)
          .makeRequest()
      )
    ).toMatchSnapshot();
  }
});

test("stream", async () => {
  for (const job of createJobs()) {
    expect(
      await requestObject(
        job
          .messages([
            systemPrompt("you are a helpful assistant"),
            userPrompt("hi"),
          ])
          .stream()
          .makeRequest()
      )
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
    console.log(job.dump());
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
        .messages([userPrompt("hi")])
        .responseFormat({ type: "json_object" })
        .makeRequest()
    )
  ).toMatchSnapshot();
});

test("tool", async () => {
  const weatherTool = tool("get_current_weather")
    .description("Get the current weather in a given location")
    .parameters(
      z.object({
        location: z.string(),
        unit: z.enum(["celsius", "fahrenheit"]).optional(),
      })
    );

  for (const job of createJobs()) {
    expect(
      await requestObject(
        job
          .tool(weatherTool)
          .messages([userPrompt("What's the weather like in Boston today?")])
          .makeRequest()
      )
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
            userPrompt("generate a person with name and age in json format"),
          ])
          .jsonSchema(personSchema, "person")
          .makeRequest()
      )
    ).toMatchSnapshot();
  }
});
