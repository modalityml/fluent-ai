import { openai, systemPrompt, text, userPrompt } from "../src";

const job = openai({})
  .chat("gpt-4o-mini")
  .messages([systemPrompt("you are a helpful assistant"), userPrompt("hi")]);
const result = await job.run();
console.log(text(result));
console.log(job.cost);
console.log(job.performance);
