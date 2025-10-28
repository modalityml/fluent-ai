import * as z from "zod";
import { test, expect } from "bun:test";
import { agentTool } from "~/src/agent/tool";

const getWeather = (input: { location: string }) => {
  return `The weather in ${input.location} is sunny with a high of 75°F.`;
};

const getWeatherTool = agentTool("getWeather")
  .description("Retrieve the current weather for a given location")
  .input(
    z.object({
      location: z.string().describe("The location to retrieve the weather for"),
    }),
  )
  .output(z.string())
  .execute(getWeather);

test("agentTool", async () => {
  expect(getWeatherTool.build().name).toEqual("getWeather");
});
