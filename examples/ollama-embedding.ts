import { ollama } from "../src";

const job = ollama().embedding("nomic-embed-text").input("hello");
const result = await job.run();

console.log(JSON.stringify(result, null, 2));
