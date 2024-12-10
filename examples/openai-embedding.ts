import { openai } from "../src";

const job = openai().embedding("text-embedding-3-small").input("hello");
const result = await job.run();

console.log(JSON.stringify(result, null, 2));
