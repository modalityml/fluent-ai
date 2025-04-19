import { ollama, system, user } from "../src";

const job = ollama()
  .chat("llama3.2")
  .messages([system("you are a helpful assistant"), user("hi")]);
const result = await job.run();
console.log(result);
