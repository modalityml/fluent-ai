import { voyageai } from "../src";

const job = voyageai().embedding("voyage-3-lite").input("hello");
const result = await job.run();
console.log(result);
