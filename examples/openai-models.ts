import { openai } from "../src";

const job = openai().models();
const result = await job.run();

console.log(result);
