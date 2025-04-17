import { EventSourceParserStream } from "eventsource-parser/stream";

export class ChatStream {
  private chunks: any[] = [];
  private completeText: string = "";
  private toolCalls: any = null;
  private finishReason: string | null = null;
  private resultReady: boolean = false;
  private result: any = null;

  constructor(response: Response) {
    this.processStream(response);
  }

  private async processStream(response: Response) {
    const eventStream = response
      .body!.pipeThrough(new TextDecoderStream())
      .pipeThrough(new EventSourceParserStream());
    const reader = eventStream.getReader();

    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (value.data === "[DONE]") {
        break;
      }

      const chunk = JSON.parse(value.data);
      this.chunks.push(chunk);

      if (chunk.choices[0].finish_reason) {
        this.finishReason = chunk.choices[0].finish_reason;
      } else if (chunk.choices[0].delta.content) {
        this.completeText += chunk.choices[0].delta.content;
      } else if (chunk.choices[0].delta.tool_calls) {
        // Handle tool calls
        if (!this.toolCalls) {
          this.toolCalls = chunk.choices[0].delta.tool_calls;
        } else {
          // Merge tool calls data
          for (let i = 0; i < chunk.choices[0].delta.tool_calls.length; i++) {
            const deltaToolCall = chunk.choices[0].delta.tool_calls[i];
            if (!this.toolCalls[i]) {
              this.toolCalls[i] = deltaToolCall;
            } else {
              if (deltaToolCall.function) {
                if (!this.toolCalls[i].function) {
                  this.toolCalls[i].function = deltaToolCall.function;
                } else {
                  if (deltaToolCall.function.name) {
                    this.toolCalls[i].function.name =
                      deltaToolCall.function.name;
                  }
                  if (deltaToolCall.function.arguments) {
                    this.toolCalls[i].function.arguments =
                      (this.toolCalls[i].function.arguments || "") +
                      deltaToolCall.function.arguments;
                  }
                }
              }
            }
          }
        }
      }
    }

    this.resultReady = true;
  }

  async done() {
    // Wait until stream processing is complete
    while (!this.resultReady) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    if (!this.result) {
      if (this.toolCalls) {
        this.result = {
          text: this.completeText,
          toolCalls: this.toolCalls,
        };
      } else {
        // Check if content is JSON
        try {
          const parsed = JSON.parse(this.completeText);
          this.result = { text: this.completeText, object: parsed };
        } catch (e) {
          this.result = { text: this.completeText };
        }
      }
    }

    return this.result;
  }

  [Symbol.asyncIterator]() {
    let index = 0;
    return {
      next: async () => {
        if (index < this.chunks.length) {
          return { done: false, value: this.chunks[index++] };
        } else if (!this.resultReady) {
          // Wait a bit to see if more chunks arrive
          await new Promise((resolve) => setTimeout(resolve, 10));
          if (index < this.chunks.length) {
            return { done: false, value: this.chunks[index++] };
          }
        }
        return { done: true, value: undefined };
      },
    };
  }
}
