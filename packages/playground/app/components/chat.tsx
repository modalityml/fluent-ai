import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { ChatInput, Job, ChatTool } from "fluent-ai";
import { Plus, Trash2 } from "lucide-react";

interface Provider {
  name: string;
  displayName: string;
  models: Array<{ id: string; name: string }>;
}

interface ChatProps {
  job: Job;
  onChange: (job: Job) => void;
  providers: Provider[];
  onSubmit: (job: Job) => void;
  loading?: boolean;
  error?: string | null;
  output?: any;
}

export const ChatPlayground = ({
  job,
  onChange,
  providers,
  onSubmit,
  loading = false,
  error = null,
  output = null,
}: ChatProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(job);
  };
  const input = job.body.input as ChatInput;
  const systemPrompt =
    input.messages[0]?.role === "system" ? input.messages[0].content : "";
  const messages = systemPrompt ? input.messages.slice(1) : input.messages;
  const currentProvider = providers.find((p) => p.name === job.provider);

  function addMessage() {
    const updatedMessages = [
      ...input.messages,
      { role: "user" as const, content: "" },
    ];
    onChange({
      ...job,
      body: {
        type: "chat",
        input: {
          ...input,
          messages: updatedMessages,
        },
      },
    } as Job);
  }

  function updateMessageRole(index: number, role: "user" | "assistant") {
    const updatedMessages = [...input.messages];
    updatedMessages[index] = { ...updatedMessages[index], role };
    onChange({
      ...job,
      body: {
        type: "chat",
        input: {
          ...input,
          messages: updatedMessages,
        },
      },
    } as Job);
  }

  function removeMessage(index: number) {
    const actualIndex = systemPrompt ? index + 1 : index;
    const updatedMessages = input.messages.filter((_, i) => i !== actualIndex);
    onChange({
      ...job,
      body: {
        type: "chat",
        input: {
          ...input,
          messages: updatedMessages,
        },
      },
    } as Job);
  }

  function updateMessage(index: number, content: string) {
    const actualIndex = systemPrompt ? index + 1 : index;
    const updatedMessages = [...input.messages];
    updatedMessages[actualIndex] = {
      ...updatedMessages[actualIndex],
      content,
    };
    onChange({
      ...job,
      body: {
        type: "chat",
        input: {
          ...input,
          messages: updatedMessages,
        },
      },
    } as Job);
  }

  function handleProviderChange(provider: string) {
    onChange({
      ...job,
      provider,
    } as Job);
  }

  function setApiKey(apiKey: string) {
    onChange({
      ...job,
      options: {
        ...job.options,
        apiKey,
      },
    });
  }

  function setModel(model: string) {
    onChange({
      ...job,
      body: {
        type: "chat",
        input: {
          ...input,
          model,
        },
      },
    } as Job);
  }

  function setTemperature(temperature: number) {
    onChange({
      ...job,
      body: {
        type: "chat",
        input: {
          ...input,
          temperature,
        },
      },
    } as Job);
  }

  function setMaxTokens(maxTokens: number) {
    onChange({
      ...job,
      body: {
        type: "chat",
        input: {
          ...input,
          maxTokens,
        },
      },
    } as Job);
  }

  function updateSystemPrompt(content: string) {
    const updatedMessages = [...input.messages];
    if (systemPrompt) {
      // Update existing system message
      updatedMessages[0] = { role: "system" as const, content };
    } else {
      // Add new system message at the beginning
      updatedMessages.unshift({ role: "system" as const, content });
    }
    onChange({
      ...job,
      body: {
        type: "chat",
        input: {
          ...input,
          messages: updatedMessages,
        },
      },
    } as Job);
  }

  function addTool() {
    const updatedTools = [
      ...(input.tools || []),
      { name: "", description: "", input: {} },
    ];
    onChange({
      ...job,
      body: {
        type: "chat",
        input: {
          ...input,
          tools: updatedTools,
        },
      },
    } as Job);
  }

  function removeTool(index: number) {
    const updatedTools = (input.tools || []).filter((_, i) => i !== index);
    onChange({
      ...job,
      body: {
        type: "chat",
        input: {
          ...input,
          tools: updatedTools.length > 0 ? updatedTools : undefined,
        },
      },
    } as Job);
  }

  function updateTool(index: number, field: keyof ChatTool, value: any) {
    const updatedTools = [...(input.tools || [])];
    updatedTools[index] = { ...updatedTools[index], [field]: value };
    onChange({
      ...job,
      body: {
        type: "chat",
        input: {
          ...input,
          tools: updatedTools,
        },
      },
    } as Job);
  }

  function updateToolInput(index: number, value: string) {
    try {
      const parsedInput = JSON.parse(value);
      updateTool(index, "input", parsedInput);
    } catch (e) {
      // Keep the raw string if it's not valid JSON yet
      updateTool(index, "input", value);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex overflow-hidden">
      <div className="w-80 border-r flex flex-col bg-card">
        <ScrollArea className="flex-1">
          <div className="flex flex-col">
            <div className="px-4 py-3 border-b bg-card flex items-center justify-between">
              <h2 className="text-sm font-semibold">System</h2>
              <Button
                type="button"
                onClick={() => updateSystemPrompt("")}
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
              >
                Clear
              </Button>
            </div>
            <div className="p-4">
              <Textarea
                id="systemPrompt"
                name="systemPrompt"
                value={systemPrompt}
                onChange={(e) => updateSystemPrompt(e.target.value)}
                placeholder="You are a helpful assistant."
                className="min-h-[200px] resize-none"
              />
            </div>

            <div className="px-4 py-3 border-t border-b bg-card flex items-center justify-between">
              <h2 className="text-sm font-semibold">Tools</h2>
              <Button
                type="button"
                onClick={addTool}
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" /> Add Tool
              </Button>
            </div>
            <div className="p-4 space-y-4">
              {(!input.tools || input.tools.length === 0) && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No tools added yet
                </p>
              )}
              {input.tools?.map((tool, index) => (
                <div
                  key={index}
                  className="space-y-3 pb-4 border-b last:border-b-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Tool {index + 1}
                    </span>
                    <Button
                      type="button"
                      onClick={() => removeTool(index)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`tool-name-${index}`} className="text-xs">
                      Name
                    </Label>
                    <Input
                      id={`tool-name-${index}`}
                      value={tool.name}
                      onChange={(e) =>
                        updateTool(index, "name", e.target.value)
                      }
                      placeholder="function_name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`tool-description-${index}`}
                      className="text-xs"
                    >
                      Description
                    </Label>
                    <Textarea
                      id={`tool-description-${index}`}
                      value={tool.description}
                      onChange={(e) =>
                        updateTool(index, "description", e.target.value)
                      }
                      placeholder="What does this tool do?"
                      className="min-h-[60px] resize-none text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`tool-input-${index}`} className="text-xs">
                      Input Schema (JSON)
                    </Label>
                    <Textarea
                      id={`tool-input-${index}`}
                      value={
                        typeof tool.input === "string"
                          ? tool.input
                          : JSON.stringify(tool.input, null, 2)
                      }
                      onChange={(e) => updateToolInput(index, e.target.value)}
                      placeholder='{"type": "object", "properties": {...}}'
                      className="min-h-[100px] resize-none font-mono text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col border-b">
          <div className="px-4 py-3 border-b bg-card flex items-center justify-between">
            <h2 className="text-sm font-semibold">Messages</h2>
            <Button
              type="button"
              onClick={addMessage}
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
            >
              <Plus /> Add Message
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="space-y-2 pb-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center gap-2 justify-between">
                      <div className="flex items-center gap-2">
                        <Select
                          value={message.role}
                          onValueChange={(value: "user" | "assistant") =>
                            updateMessageRole(index, value)
                          }
                        >
                          <SelectTrigger className="w-32 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="assistant">Assistant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeMessage(index)}
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                        disabled={input.messages.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                    <Textarea
                      value={message.content}
                      onChange={(e) => updateMessage(index, e.target.value)}
                      placeholder="Enter message content..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>

          <div className="border-t bg-card p-4 flex justify-end">
            <Button
              type="submit"
              disabled={
                loading ||
                input.messages.length === 0 ||
                input.messages.every((m) => !m.content.trim())
              }
              className="w-auto px-6"
              size="sm"
            >
              {loading ? (
                <>
                  <span className="mr-2">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <span className="mr-2">▶</span>
                  Submit
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b bg-card">
            <h2 className="text-sm font-semibold">Output</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <div className="text-3xl animate-pulse">💭</div>
                  <p className="text-xs text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-xs text-destructive font-semibold mb-1">
                  Error
                </p>
                <p className="text-xs text-destructive/90">{error}</p>
              </div>
            )}

            {output && !error && !loading && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-semibold">
                    A
                  </div>
                  <span className="text-sm font-semibold">Assistant</span>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="space-y-3">
                    {output.messages && output.messages.length > 0 && (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">
                          {output.messages[0].content}
                        </p>
                      </div>
                    )}

                    {output.usage && (
                      <div className="pt-3 border-t">
                        <div className="flex items-center gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">
                              Tokens:
                            </span>{" "}
                            <span className="font-mono">
                              {output.usage.totalTokens.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Prompt:
                            </span>{" "}
                            <span className="font-mono">
                              {output.usage.promptTokens.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Completion:
                            </span>{" "}
                            <span className="font-mono">
                              {output.usage.completionTokens.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <details className="group">
                      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition">
                        View raw response
                      </summary>
                      <pre className="mt-2 text-xs bg-background rounded p-2 overflow-auto max-h-40">
                        {JSON.stringify(output, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </div>
            )}

            {!output && !error && !loading && (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No output yet. Submit a message to see results.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-80 border-l flex flex-col bg-card">
        <div className="px-4 py-3 border-b bg-card flex items-center justify-between">
          <h2 className="text-sm font-semibold">Options</h2>

          <Button
            type="button"
            onClick={() => {
              onChange({
                provider: job.provider,
                options: {},
                body: {
                  type: "chat",
                  input: {
                    messages: [],
                    model: "",
                    temperature: 0.7,
                    maxTokens: 1000,
                  },
                },
              } as Job);
            }}
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
          >
            Reset
          </Button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider" className="text-sm font-medium">
              Provider
            </Label>
            <Select value={job.provider} onValueChange={handleProviderChange}>
              <SelectTrigger id="provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providers.map((p) => (
                  <SelectItem key={p.name} value={p.name}>
                    {p.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-sm font-medium">
              API Key
            </Label>
            <Input
              type="text"
              id="apiKey"
              value={job.options?.apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Enter your {job.provider || "API"} key
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model" className="text-sm font-medium">
              Model
            </Label>
            <Select value={input.model} onValueChange={setModel}>
              <SelectTrigger id="model" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentProvider?.models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature" className="text-sm font-medium">
                Temperature
              </Label>
              <span className="text-sm text-muted-foreground">
                {input.temperature?.toFixed(1)}
              </span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.1}
              value={[input.temperature || 0]}
              onValueChange={(value) => setTemperature(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Controls randomness: 0 = focused, 2 = creative
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTokens" className="text-sm font-medium">
              Max Tokens
            </Label>
            <Input
              type="number"
              id="maxTokens"
              value={input.maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value) || 0)}
              min={1}
              max={100000}
            />
            <p className="text-xs text-muted-foreground">
              Maximum length of generated response
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};
