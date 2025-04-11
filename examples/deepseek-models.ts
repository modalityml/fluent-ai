import { deepseek } from "../src";

const job = deepseek().models();
const result = await job.run();

console.log(result);
