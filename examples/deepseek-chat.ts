import { openai, systemPrompt, userPrompt } from "../src";

const job = openai({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
})
  .chat("deepseek-chat")
  .messages([
    systemPrompt("you are a helpful assistant"),
    userPrompt("who are you"),
  ]);
const result = await job.run();

console.log(result);
