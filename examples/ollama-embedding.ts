import { ollama } from "../src";

const job = ollama().embedding("nomic-embed-text").value("hello");
const result = await job.run();
console.log(result);
