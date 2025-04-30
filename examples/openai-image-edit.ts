import { openai } from "../src";
import { readFileSync, writeFileSync } from "node:fs";

const job = openai()
  .image("gpt-image-1") // TODO: add support for dall-e-2
  .edit(readFileSync("./cat.jpg"))
  .prompt("add a hat to the cat")
  .size("1024x1024");

const result = await job.run();
const buffer = Buffer.from(result.raw.data[0].b64_json, "base64");
writeFileSync("cat_edit.jpg", buffer);
