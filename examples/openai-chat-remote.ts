import { openai, userPrompt } from "../src";

const job = openai()
  .chat("gpt-4o-mini")
  .messages([{ role: "user", content: "generate a 50 words text" }])
  .stream();

const stream = await job.remote();
