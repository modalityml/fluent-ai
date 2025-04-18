import { ollama, systemPrompt, userPrompt } from "../src";

const job = ollama()
  .chat("llama3.2")
  .messages([systemPrompt("you are a helpful assistant"), userPrompt("hi")]);
const result = await job.run();
console.log(result);
