# Streaming in chat completions

## Stream options

```ts
export interface StreamOptions {
  includeUsage?: boolean;
}
```

## Text streaming

```ts
const { textStream } = await openai()
  .chat("gpt-4o-mini")
  .messages([user("hi")])
  .stream()
  .run();

for await (const text of textStream) {
  process.stdout.write(text);
}
```

## Streaming with tools

```ts
const { toolCallStream } = await openai()
  .chat("gpt-4o-mini")
  .tool(weatherTool)
  .messages([user("What's the weather like in Boston, Beijing, Tokyo today?")])
  .stream()
  .run();

for await (const toolCalls of toolCallStream) {
  console.log(toolCalls);
}
```

## Structured output streaming

```ts
const { objectStream } = await openai()
  .chat("gpt-4o-mini")
  .messages([user("generate a person with name and age in json format")])
  .responseSchema(personSchema)
  .objectStream()
  .run();

for await (const object of objectStream) {
  console.log(object);
}
```

## Chunk Stream

The original chunk object from providers

```ts
const { stream } = await openai()
  .chat("gpt-4o-mini")
  .messages([user("hi")]);

for await (const chunk of stream) {
  console.log(chunk);
}
```
