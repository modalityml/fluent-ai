import { openai, systemPrompt, userPrompt, load } from "../src";

const job = openai({})
  .chat("gpt-4o-mini")
  .messages([systemPrompt("you are a helpful assistant"), userPrompt("hi")]);
const result = await job.run();

console.log(result);
