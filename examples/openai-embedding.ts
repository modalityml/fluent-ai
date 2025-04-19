import { openai } from "../src";

const job = openai().embedding("text-embedding-3-small").value("hello");
const result = await job.run();
console.log(result.embedding);
console.log(job.cost);
console.log(job.performance);
