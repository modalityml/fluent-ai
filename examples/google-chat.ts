import { google, systemPrompt, userPrompt } from "../src";

const job = google()
  .chat("gemini-1.5-flash")
  .messages([systemPrompt("you are a helpful assistant"), userPrompt("hi")]);
const result = await job.run();

console.log(result);
