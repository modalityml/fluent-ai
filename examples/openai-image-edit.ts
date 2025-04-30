import { openai } from "../src";
import { readFileSync, writeFileSync } from "node:fs";

const job = openai()
  .image("dall-e-2")
  .edit(readFileSync("./cat.jpg"))
  .prompt("add a hat to the cat")
  .size("512x512")
  .responseFormat("b64_json");

try {
  const result = await job.run();
  const buffer = Buffer.from(result.raw.data[0].b64_json, "base64");
  writeFileSync("cat_edit.jpg", buffer);
} catch (error) {
  console.error("Error:", error.json);
}
