import { z } from "zod";
import { openai, tool, userPrompt } from "../src";

const weatherTool = tool("get_current_weather")
  .description("Get the current weather in a given location")
  .parameters(
    z.object({
      location: z.string(),
      unit: z.enum(["celsius", "fahrenheit"]).optional(),
    })
  );
const job = openai()
  .chat("gpt-4o-mini")
  .tool(weatherTool)
  .messages([
    userPrompt("What's the weather like in Boston, Beijing, Tokyo today?"),
  ]);
const result = await job.run();
console.log(JSON.stringify(result.raw, null, 2));
