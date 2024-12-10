# Structured outputs in Chat completions

Prompt engineering has been a incresing demand skillset on the market. One of the most importance skills in prompt engineering is to instruct language model to generate a structure object for given prompt. Compared to text (mostly in chatbot), generating a structure object, especially based on predfined schema, is essential to integrate language model to real-world applications, such as information extraction, dynamic, user interface generation etc.

In this docs, we compared different approaches in generateing structed outputs from chat compleetionts with lanaguage models providers.

## response_format: json_schema

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
