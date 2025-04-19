import { EventSourceParserStream } from "eventsource-parser/stream";

export function jobStream<Output>(response: Response) {
  return (async function* () {
    const eventStream = response
      .body!.pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream());
    const reader = eventStream.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done || value.data === "[DONE]") {
        break;
      }
      const chunk = JSON.parse(value.data);
      yield { raw: chunk } as Output;
    }
  })();
}
