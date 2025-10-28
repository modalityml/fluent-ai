import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import type { Route } from "./+types/home";
import { runner } from "../../../fluent-ai/src/job/runner";
import type { Job } from "../../../fluent-ai/src/job/schema";

export const loader = async ({ request }: Route.LoaderArgs) => {
  return {
    providers: [
      {
        name: "openrouter",
        displayName: "OpenRouter",
        models: [
          { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash" },
          { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
          { id: "openai/gpt-4-turbo", name: "GPT-4 Turbo" },
          { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
          { id: "meta-llama/llama-3.1-70b-instruct", name: "Llama 3.1 70B" },
        ],
      },
    ],
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const job: Job = await request.json();

  try {
    const output = await runner.run(job);
    return { success: true, output };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export default function Home({
  loaderData: { providers },
}: Route.ComponentProps) {
  const [provider, setProvider] = useState(providers[0]?.name || "openrouter");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(providers[0]?.models[0]?.id || "");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant."
  );
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([{ role: "user", content: "Hi, tell me a short joke!" }]);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [output, setOutput] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current provider data
  const currentProvider = providers.find((p) => p.name === provider);
  const availableModels = currentProvider?.models || [];

  // Update model when provider changes
  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    const newProviderData = providers.find((p) => p.name === newProvider);
    if (newProviderData?.models.length) {
      setModel(newProviderData.models[0].id);
    }
  };

  // Message management functions
  const addMessage = () => {
    setMessages([...messages, { role: "user", content: "" }]);
  };

  const removeMessage = (index: number) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  const updateMessage = (index: number, content: string) => {
    const newMessages = [...messages];
    newMessages[index].content = content;
    setMessages(newMessages);
  };

  const updateMessageRole = (index: number, role: "user" | "assistant") => {
    const newMessages = [...messages];
    newMessages[index].role = role;
    setMessages(newMessages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      const job: Job = {
        provider: provider as any,
        options: { apiKey: apiKey as string },
        body: {
          type: "chat",
          input: {
            model: model as string,
            messages: [{ role: "system", content: systemPrompt }, ...messages],
            temperature: temperature,
            maxTokens: maxTokens,
          },
        },
      };

      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(job),
      });

      const result = await response.json();

      if (result.success) {
        setOutput(result.output);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <title>Playground</title>

      <div className="border-b bg-card flex-shrink-0">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold tracking-tight">Playground</h1>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <form onSubmit={handleSubmit} className="flex-1 flex overflow-hidden">
          <div className="w-80 border-r flex flex-col bg-card">
            <div className="px-4 py-3 border-b">
              <h2 className="text-sm font-semibold">System</h2>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <Textarea
                id="systemPrompt"
                name="systemPrompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="You are a helpful assistant."
                className="min-h-[200px] resize-none"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {/* Top Half - User Input */}
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
                  + Add Message
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4">
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
                              <SelectItem value="assistant">
                                Assistant
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeMessage(index)}
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                          disabled={messages.length === 1}
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

              <div className="border-t bg-card p-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    loading ||
                    !apiKey ||
                    messages.length === 0 ||
                    messages.every((m) => !m.content.trim())
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
                      <p className="text-xs text-muted-foreground">
                        Thinking...
                      </p>
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
            <div className="px-4 py-3 border-b">
              <h2 className="text-sm font-semibold">Options</h2>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider" className="text-sm font-medium">
                  Provider
                </Label>
                <Select value={provider} onValueChange={handleProviderChange}>
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
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Enter your {currentProvider?.displayName || "API"} key
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model" className="text-sm font-medium">
                  Model
                </Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger id="model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((m) => (
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
                    {temperature.toFixed(1)}
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[temperature]}
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
                  value={maxTokens}
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
      </div>
    </div>
  );
}
