import { systemPrompt, together, userPrompt } from "../src";

const job = together()
  .chat("meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo")
  .messages([
    systemPrompt("you are a helpful assistant"),
    userPrompt("who are you"),
  ]);

const result = await job.run();
console.log(result.text);
