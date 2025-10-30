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
import { Textarea } from "~/components/ui/textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { Job } from "fluent-ai";
import { Plus, Trash2 } from "lucide-react";

interface Provider {
  name: string;
  displayName: string;
  models: Array<{ id: string; name: string }>;
}

interface EmbeddingProps {
  job: Job;
  onChange: (job: Job) => void;
  providers: Provider[];
  onSubmit: (job: Job) => void;
  loading?: boolean;
  error?: string | null;
  output?: any;
}

export const EmbeddingPlayground = ({
  job,
  onChange,
  providers,
  onSubmit,
  loading = false,
  error = null,
  output = null,
}: EmbeddingProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(job);
  };

  const input = job.body.input as any;
  const currentProvider = providers.find((p) => p.name === job.provider);

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
        type: "embedding",
        input: {
          ...input,
          model,
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

  function setInputText(text: string) {
    onChange({
      ...job,
      body: {
        type: "embedding",
        input: {
          ...input,
          input: text,
        },
      },
    } as Job);
  }

  function addInput() {
    const currentInputs = Array.isArray(input.input)
      ? input.input
      : input.input
      ? [input.input]
      : [];
    onChange({
      ...job,
      body: {
        type: "embedding",
        input: {
          ...input,
          input: [...currentInputs, ""],
        },
      },
    } as Job);
  }

  function removeInput(index: number) {
    if (Array.isArray(input.input)) {
      const updatedInputs = input.input.filter(
        (_: string, i: number) => i !== index
      );
      onChange({
        ...job,
        body: {
          type: "embedding",
          input: {
            ...input,
            input:
              updatedInputs.length === 1 ? updatedInputs[0] : updatedInputs,
          },
        },
      } as Job);
    }
  }

  function updateInput(index: number, text: string) {
    if (Array.isArray(input.input)) {
      const updatedInputs = [...input.input];
      updatedInputs[index] = text;
      onChange({
        ...job,
        body: {
          type: "embedding",
          input: {
            ...input,
            input: updatedInputs,
          },
        },
      } as Job);
    }
  }

  const inputArray = Array.isArray(input.input)
    ? input.input
    : input.input
    ? [input.input]
    : [""];

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col border-b">
          <div className="px-4 py-3 border-b bg-card flex items-center justify-between">
            <h2 className="text-sm font-semibold">Input Text</h2>
            {Array.isArray(input.input) && (
              <Button
                type="button"
                onClick={addInput}
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
              >
                <Plus /> Add Input
              </Button>
            )}
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4">
              {!Array.isArray(input.input) ? (
                <div className="space-y-2">
                  <Textarea
                    value={input.input as string}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text to generate embeddings..."
                    className="min-h-[200px] resize-none"
                  />
                  <Button
                    type="button"
                    onClick={addInput}
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                  >
                    <Plus /> Add Multiple Inputs
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {inputArray.map((text: string, index: number) => (
                    <div
                      key={index}
                      className="space-y-2 pb-4 border-b last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Input {index + 1}
                        </span>
                        <Button
                          type="button"
                          onClick={() => removeInput(index)}
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                          disabled={inputArray.length === 1}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Textarea
                        value={text}
                        onChange={(e) => updateInput(index, e.target.value)}
                        placeholder="Enter text..."
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t bg-card p-4 flex justify-end">
            <Button
              type="submit"
              disabled={
                loading ||
                !input.input ||
                (Array.isArray(input.input) &&
                  input.input.every((text: string) => !text.trim())) ||
                (!Array.isArray(input.input) && !(input.input as string).trim())
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
                  Generate Embeddings
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
                  <div className="text-3xl animate-pulse">🔢</div>
                  <p className="text-xs text-muted-foreground">
                    Generating embeddings...
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
              <div className="space-y-4">
                {output.embeddings && output.embeddings.length > 0 && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                        E
                      </div>
                      <span className="text-sm font-semibold">
                        Embeddings Generated
                      </span>
                    </div>

                    <div className="space-y-3">
                      {output.embeddings.map(
                        (embedding: number[], index: number) => (
                          <div
                            key={index}
                            className="bg-muted/50 rounded-lg p-4 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold">
                                Embedding {index + 1}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Dimensions: {embedding.length}
                              </span>
                            </div>
                            <div className="bg-background rounded p-3">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <span>First 10 values:</span>
                              </div>
                              <div className="font-mono text-xs space-y-1">
                                {embedding.slice(0, 10).map((val, idx) => (
                                  <div key={idx} className="flex gap-2">
                                    <span className="text-muted-foreground w-6">
                                      [{idx}]:
                                    </span>
                                    <span>{val.toFixed(6)}</span>
                                  </div>
                                ))}
                                {embedding.length > 10 && (
                                  <div className="text-muted-foreground pt-1">
                                    ... and {embedding.length - 10} more values
                                  </div>
                                )}
                              </div>
                            </div>

                            <details className="group">
                              <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition">
                                View full embedding
                              </summary>
                              <pre className="mt-2 text-xs bg-background rounded p-2 overflow-auto max-h-60">
                                {JSON.stringify(embedding, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )
                      )}
                    </div>

                    <details className="group">
                      <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition">
                        View raw response
                      </summary>
                      <pre className="mt-2 text-xs bg-background rounded p-2 overflow-auto max-h-40">
                        {JSON.stringify(output, null, 2)}
                      </pre>
                    </details>
                  </>
                )}
              </div>
            )}

            {!output && !error && !loading && (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No output yet. Enter text and click Generate Embeddings to see
                results.
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
                  type: "embedding",
                  input: {
                    model: "",
                    input: "",
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
              value={job.options?.apiKey || ""}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pa-..."
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

          <div className="pt-4 border-t space-y-2">
            <h3 className="text-sm font-semibold">About Embeddings</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Embeddings are numerical representations of text that capture
              semantic meaning. They're useful for:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 pl-4">
              <li>• Semantic search</li>
              <li>• Text similarity comparison</li>
              <li>• Clustering and classification</li>
              <li>• Recommendation systems</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
};
