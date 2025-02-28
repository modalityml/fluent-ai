import { openai, systemPrompt, userPrompt } from "../src";

const job = openai({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai",
})
  .chat("llama-3.1-sonar-small-128k-online")
  .messages([
    systemPrompt("Be precise and concise."),
    userPrompt("How many stars are there in our galaxy?"),
  ]);
const result = await job.run();

console.log(result);
