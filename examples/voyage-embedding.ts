import { voyage } from "../src";

const job = voyage().embedding("voyage-3-lite").value("hello");
const result = await job.run();
console.log(result);
