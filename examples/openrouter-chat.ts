import * as z from "zod";
import { tool } from "~/src/builder/chat";
import { openrouter } from "~/src/builder/providers";

// const job = openrouter()
//   .chat()
//   .model("google/gemini-2.5-flash")
//   .messages([
//     system("You are a helpful assistant."),
//     user("write a 100 words story"),
//   ])
//   .temperature(0.7)
//   .maxTokens(100)
//   .stream();

// for await (const chunk of job.run()) {
//   process.stdout.write(text(chunk));
// }

const weatherTool = tool("get_current_weather")
  .description("Get the current weather in a given location")
  .input(
    z.object({
      location: z.string(),
      unit: z.enum(["celsius", "fahrenheit"]).optional(),
    }),
  );

const job = openrouter()
  .chat()
  .model("google/gemini-2.5-flash")
  .tool(weatherTool)
  .messages([
    {
      role: "user",
      content: "What's the weather like in Boston, Beijing, Tokyo today?",
    },
  ]);
const result = await job.run();
console.log(JSON.stringify(result, null, 2));
