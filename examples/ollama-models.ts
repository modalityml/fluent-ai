import { ollama } from "../src";

const job = ollama().models();
const result = await job.run();

console.log(result);
