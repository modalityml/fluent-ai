import { ollama } from "../src";

const job = ollama().listModels();
const result = await job.run();

console.log(result);
