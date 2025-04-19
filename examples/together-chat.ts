import { system, together, user } from "../src";

const job = together()
  .chat("meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo")
  .messages([system("you are a helpful assistant"), user("who are you")]);

const result = await job.run();
console.log(result.text);
