import { deepseek, systemPrompt, userPrompt } from "../src";

const job = deepseek()
  .chat("deepseek-chat")
  .messages([
    systemPrompt("you are a helpful assistant"),
    userPrompt("who are you"),
  ]);
const result = await job.run();

console.log(result);
