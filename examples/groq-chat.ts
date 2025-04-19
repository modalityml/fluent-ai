import { openai, system, user } from "../src";

const job = openai({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
})
  .chat("meta-llama/llama-4-scout-17b-16e-instruct")
  .messages([system("you are a helpful assistant"), user("who are you")]);
const result = await job.run();

console.log(result);
