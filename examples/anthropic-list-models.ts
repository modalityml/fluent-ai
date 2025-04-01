import { anthropic } from "../src";

const models = await anthropic().models();

console.log(models);
