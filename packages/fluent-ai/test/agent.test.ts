import * as z from "zod";
import { test, expect } from "bun:test";
import { agent, agentTool, openrouter } from "~/src/index";

test("agent", async () => {
  const getWeather = (input: { location: string }) => {
    return `The weather in ${input.location} is sunny with a high of 75°F.`;
  };

  const getWeatherTool = agentTool("getWeather")
    .description("Retrieve the current weather for a given location")
    .input(
      z.object({
        location: z
          .string()
          .describe("The location to retrieve the weather for"),
      }),
    )
    .output(z.string())
    .execute(getWeather);

  const weatherAgent = agent("weather-agent")
    .model(openrouter().chat("test-model"))
    .tool(getWeatherTool);

  expect(getWeatherTool.build().name).toEqual("getWeather");
  weatherAgent.generate([], { maxSteps: 3 });
});

test("agent context", async () => {
  interface Database {
    query: (sql: string) => string;
  }

  const queryTool = agentTool("database-query")
    .description("Execute a SQL query against the database")
    .input(
      z.object({
        query: z.string().describe("The SQL query to execute"),
      }),
    )
    .output(z.string())
    .execute(async (input, { db }) => {
      const result = db.query(input.query);
      return result;
    });

  const sqlAgent = agent<{ db: Database }>("sql-agent")
    .model(openrouter().chat("test-model"))
    .tool(queryTool);
  sqlAgent.generate(
    [],
    { maxSteps: 2 },
    {
      db: {
        query: (sql: string) => `Executed: ${sql}`,
      },
    },
  );
});
