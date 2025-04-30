import { openai } from "../src";
import { writeFileSync } from "node:fs";

const job = openai()
  .image("dall-e-2")
  .prompt("a cat")
  .size("512x512")
  .outputFormat("jpeg")
  .responseFormat("b64_json");

const result = await job.run();
const buffer = Buffer.from(result.raw.data[0].b64_json, "base64");
writeFileSync("cat.jpg", buffer);
