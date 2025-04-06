import { openai, systemPrompt, userPrompt } from "../src";

const job = openai({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
})
  .chat("meta-llama/llama-4-scout-17b-16e-instruct")
  .messages([
    systemPrompt("you are a helpful assistant"),
    userPrompt("who are you"),
  ]);
const result = await job.run();

console.log(result);
