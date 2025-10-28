# fluent-ai

[![NPM Version](https://img.shields.io/npm/v/fluent-ai)](http://npmjs.com/fluent-ai)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/modalityml/fluent-ai/test.yml)](https://github.com/modalityml/fluent-ai/actions/workflows/test.yml)

> [!WARNING]
> This project is in beta. The API is subject to changes and may break.

fluent-ai is a lightweight, type-safe AI toolkit that seamlessly integrates multiple AI providers. It features structured outputs, streaming capabilities, and job serialization support.

## Installation

[Zod](https://zod.dev/) is a popular type of validation library for TypeScript and JavaScript that allows developers to define and validate data schemas in a concise and type-safe manner. fluent-ai is built upon zod.

```sh
npm install fluent-ai zod
```

## AI Service provider support

fluent-ai includes support for multiple AI providers and modalities.

| provider   | chat completion    | embedding          | image generation   | list models        | text to speech     |
| ---------- | ------------------ | ------------------ | ------------------ | ------------------ | ------------------ |
| anthropic  | :white_check_mark: |                    |                    | :white_check_mark: |                    |
| elevenlabs |                    |                    |                    |                    | :white_check_mark: |
| fal        |                    |                    | :white_check_mark: |                    |                    |
| google     | :white_check_mark: |                    |                    |                    |                    |
| ollama     | :white_check_mark: | :white_check_mark: |                    | :white_check_mark: |                    |
| openai     | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| voyage     |                    | :white_check_mark: |                    |                    |                    |

By default, API keys for providers are read from environment variable (`process.env`) following the format `<PROVIDER>_API_KEY` (e.g., `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`).

You can also initialize a provider with manual API key settings:

```ts
import { openai } from "fluent-ai";

openai({ apiKey: "<key>" });
```

For more examples with different AI providers, check out the [examples](/examples/) directory.

Don't see your AI providers? Feel free to [open an issue](https://github.com/modalityml/fluent-ai/issues) or [start a discussion](https://github.com/modalityml/fluent-ai/discussions) to request support. [Join our Discord community](https://discord.gg/HzGZWbY8Fx)

## Job API

Each request to AI providers is wrapped in a `Job`. which can also serialized and deserialized. A [fluent](https://en.wikipedia.org/wiki/Fluent_interface) API with method chaining help create jobs easily.

### Method chaining

```ts
import { openai, user } from "fluent-ai";

const job = openai()
  .chat("gpt-4o-mini")
  .messages([user("Hi")])
  .temperature(0.5)
  .maxTokens(1024);
```

### Declaration

Alternatively, fluent-ai supports declarative job creation using JSON objects, with full TypeScript autocompletion support.

```ts
import { load } from "fluent-ai";

const job = load({
  provider: "openai",
  type: "chat",
  input: {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "hi" }],
    temperature: 0.5,
  },
});
```

fluent-ai provides built-in TypeScript type definitions and schema validation for jobs:

```ts
import { type Job } from "fluent-ai"; // TypeScript type
import { JobSchema } from "fluent-ai"; // Zod schema
import { jobJSONSchema } from "fluent-ai"; // JSON Schema
```

### Job serialization and deserialization

To serialize a job to a JSON object, use the `dump` method:

```ts
const payload = job.dump();
```

This allows you to save the job's state for later use, such as storing it in a queue or database.
To recreate and execute a job from the JSON object, use the `load` function:

```ts
import { load } from "fluent-ai";

const job = load(payload);
await job.run();
```

## Chat completions

Chat completion, such as ChatGPT, is the most common AI service. It generates responses in a conversational format based on given inputs, also knows as prompts.

### Text generation

```ts
import { openai, system, user, text } from "fluent-ai";

const job = openai()
  .chat("gpt-4o-mini")
  .messages([system("You are a helpful assistant"), user("Hi")]);

const result = await job.run();
console.log(text(result));
```

### Function calling (tool calling)

Function calling (or tool calling) is an advanced functionality in chat completions that enhances their ability to interact with external systems and perform specific tasks.

Here's how to create a tool:

```ts
import * as z from "zod";
import { tool } from "fluent-ai";

const weatherTool = tool("get_current_weather")
  .description("Get the current weather in a given location")
  .input(
    z.object({
      location: z.string(),
      unit: z.enum(["celsius", "fahrenheit"]).optional(),
    }),
  );
```

To use the tool, add it to a chat job with a function-calling-enabled model, such as `gpt-4o-mini` from openai.

```ts
const job = openai().chat("gpt-4o-mini").tool(weatherTool);

await job.messages([user("What is the weather in San Francisco?")]).run();
```

### Streaming support

Rather than waiting for the complete response, streaming enables the model to return portions of the response as they're generated. fluent-ai provides built-in streaming support for text, objects, and tools in chat models.

```ts
const job = openai()
  .chat("gpt-4o-mini")
  .messages([system("You are a helpful assistant"), user("Hi")])
  .stream();

for await (const event of await job.run()) {
  console.log(text(event));
}
```

fluent-ai supports streaming text, object and tool calls on demand. For more details, see the [streaming docs](/docs/chat-streaming.md).

## Embedding

```ts
import { openai } from "fluent-ai";

const job = openai().embedding("text-embedding-3-small").value("hello");
const result = await job.run();
```

## Image generation

```ts
import { openai } from "fluent-ai";

const job = openai().image("dalle-2").prompt("a cat").n(1).size("512x512");
const result = await job.run();
```

## List models

fluent-ai provides an easy way to retrieve all available models from supported providers (openai, anthropic, ollama).

```ts
import { openai } from "fluent-ai";

const models = await openai().models().run();
```

## Text to Speech

```ts
import { openai } from "fluent-ai";

const job = openai().model("tts-1").text("hi");
const result = await job.run();
```

## Support

Feel free to [open an issue](https://github.com/modalityml/fluent-ai/issues) or [start a discussion](https://github.com/modalityml/fluent-ai/discussions) if you have any questions. If you would like to request support for a new AI provider, please create an issue with details about the provider's API. [Join our Discord community](https://discord.gg/HzGZWbY8Fx) for help and updates.

## License

fluent-ai is licensed under Apache 2.0 as found in the LICENSE file.
