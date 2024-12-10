import { fireworks, systemPrompt, userPrompt } from "../src";

const job = await fireworks()
  .chat("accounts/fireworks/models/llama-v3p1-70b-instruct")
  .messages([systemPrompt("you are a helpful assistant"), userPrompt("hi")]);
const result = await job.run();

console.log(result);
