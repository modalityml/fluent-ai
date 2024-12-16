# Guide to Structured Outputs in Chat Completions

Structured outputs are crucial when working with Language Models (LLMs) in real-world applications. Rather than generating plain text responses, structured outputs enable you to receive data in predefined formats that are easier to process and integrate into applications.

As demand for prompt engineering continues to grow, one of the most important skills in this field is instructing a language model to generate structured data. While traditional text-based outputs (like those used in chatbots) are useful, structured outputs—especially those based on predefined schemas—are essential for real-world applications such as information extraction, dynamic user interface generation, and more.

This guide explores different approaches for generating structured outputs from chat completions across various language model providers.

## 1. JSON Schema Response Format

```ts
import { openai } from "fluent-ai";

const personSchema = {
  name: "person",
  strict: true,
  schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      age: {
        type: "number",
      },
    },
    required: ["name", "age"],
    additionalProperties: false,
  },
};

openai()
  .chat("gpt-4o-mini")
  .messages([
    {
      role: "user",
      content: "generate a person with name and age in json format",
    },
  ])
  .responseFormat(personSchema);
```

## response_format: json_object

```ts
import { openai } from "fluent-ai";

openai()
  .chat("gpt-4o-mini")
  .messages([
    {
      role: "user",
      content: "generate a person with name and age in json format",
    },
  ])
  .jsonObject();
```

## tool argument

```ts
import { openai, tool } from "fluent-ai";

const schema = tool("person")
  .description("person with name and age")
  .parameters({
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "person name",
      },
      age: {
        type: "number",
        description: "person age",
      },
    },
    required: ["name", "age"],
  });
openai().chat("gpt-4o-mini").tool(schema);
```

## jsonSchema() in fluent-ai

jsonSchema is a fluent-ai API for structure output

```ts
const personSchema = z.object({
  name: z.string(),
  age: z.number(),
});

const { object } = await openai()
  .chat("gpt-4o-mini")
  .schema(personSchema)
  .run();
```
