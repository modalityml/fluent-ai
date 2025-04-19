import { anthropic } from "../src";

const job = anthropic().models();
const result = await job.run();
console.log(result);
