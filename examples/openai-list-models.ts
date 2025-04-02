import { openai } from "../src";

const job = openai().listModels();
const result = await job.run();

console.log(result);