import { anthropic } from "../src";

const job = anthropic().listModels();
const result = await job.run();

console.log(result);