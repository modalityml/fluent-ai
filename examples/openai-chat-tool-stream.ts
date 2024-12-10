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
  ])
  .stream();

const { toolCallStream } = await job.stream().run();

for await (const toolCall of toolCallStream) {
  console.log(toolCall);
}
