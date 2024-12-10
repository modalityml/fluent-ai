import { test, expect } from "bun:test";
import {
  openai,
  google,
  ollama,
  systemPrompt,
  userPrompt,
  tool,
  anthropic,
  fireworks,
  requestObject,
} from "../src";
import { z } from "zod";

// prettier-ignore
const jobs = [
  openai({ apiKey: "<key>" }).chat("gpt-4o-mini"),
  google({ apiKey: "<key>" }).chat("gemini-1.5-flash"),
  anthropic({ apiKey: "<key>" }).chat("claude-3-5-sonnet-20241022"),
  ollama().chat("llama3.2"),
  fireworks({apiKey: "<key>"}).chat("accounts/fireworks/models/llama-v3p1-70b-instruct"),
];

test("chat", async () => {
  for (const job of jobs) {
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

test("function calling", async () => {
  const weatherTool = tool("get_current_weather")
    .description("Get the current weather in a given location")
    .parameters({
      type: "object",
      properties: {
        location: {
          type: "string",
          description: "The city and state, e.g. San Francisco, CA",
        },
        unit: {
          type: "string",
          enum: ["celsius", "fahrenheit"],
        },
      },
      required: ["location"],
    });

  for (const job of jobs) {
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

test("zod", async () => {
  const weatherTool = tool("get_current_weather")
    .description("Get the current weather in a given location")
    .parameters(
      z.object({
        location: z.string(),
        unit: z.enum(["celsius", "fahrenheit"]).optional(),
      })
    );

  for (const job of jobs) {
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

  for (const job of jobs) {
    expect(
      await requestObject(
        job
          .messages([
            userPrompt("generate a person with name and age in json format"),
          ])
          .jsonSchema(personSchema)
          .makeRequest()
      )
    ).toMatchSnapshot();
  }
});
