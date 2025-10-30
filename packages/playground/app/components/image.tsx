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

interface Provider {
  name: string;
  displayName: string;
  models: Array<{ id: string; name: string }>;
}

interface ImageInput {
  model: string;
  prompt: string;
  size?: { width: number; height: number };
  n?: number;
}

interface ImageOutput {
  images: Array<{
    url?: string;
    b64_json?: string;
  }>;
}

interface ImageProps {
  job: Job;
  onChange: (job: Job) => void;
  providers: Provider[];
  onSubmit: (job: Job) => void;
  loading?: boolean;
  error?: string | null;
  output?: ImageOutput | null;
}

export const ImagePlayground = ({
  job,
  onChange,
  providers,
  onSubmit,
  loading = false,
  error = null,
  output = null,
}: ImageProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(job);
  };

  const input = job.body.input as ImageInput;
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

  function handleProviderChange(provider: string) {
    onChange({
      ...job,
      provider,
    } as Job);
  }

  function setModel(model: string) {
    onChange({
      ...job,
      body: {
        type: "image",
        input: {
          ...input,
          model,
        },
      },
    } as Job);
  }

  function setPrompt(prompt: string) {
    onChange({
      ...job,
      body: {
        type: "image",
        input: {
          ...input,
          prompt,
        },
      },
    } as Job);
  }

  function setSize(sizeStr: string) {
    const [width, height] = sizeStr.split("x").map(Number);
    onChange({
      ...job,
      body: {
        type: "image",
        input: {
          ...input,
          size: { width, height },
        },
      },
    } as Job);
  }

  function setN(n: number) {
    onChange({
      ...job,
      body: {
        type: "image",
        input: {
          ...input,
          n,
        },
      },
    } as Job);
  }

  const imageSizes = [
    { value: "256x256", label: "256 × 256" },
    { value: "512x512", label: "512 × 512" },
    { value: "1024x1024", label: "1024 × 1024" },
    { value: "1792x1024", label: "1792 × 1024" },
    { value: "1024x1792", label: "1024 × 1792" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex overflow-hidden">
      <div className="w-96 border-r flex flex-col bg-card">
        <div className="px-4 py-3 border-b bg-card flex items-center justify-between">
          <h2 className="text-sm font-semibold">Options</h2>
          <Button
            type="button"
            onClick={() => {
              onChange({
                provider: job.provider,
                options: {},
                body: {
                  type: "image",
                  input: {
                    model: "",
                    prompt: "",
                    size: { width: 1024, height: 1024 },
                    n: 1,
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

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider" className="text-sm font-medium">
                  Provider
                </Label>
                <Select
                  value={job.provider}
                  onValueChange={handleProviderChange}
                >
                  <SelectTrigger id="provider" className="w-full">
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
                  placeholder="Enter API key..."
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
                    <SelectValue placeholder="Select a model" />
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
                <Label htmlFor="size" className="text-sm font-medium">
                  Image Size
                </Label>
                <Select
                  value={
                    input.size
                      ? `${input.size.width}x${input.size.height}`
                      : "1024x1024"
                  }
                  onValueChange={setSize}
                >
                  <SelectTrigger id="size" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {imageSizes.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Resolution of generated images
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="n" className="text-sm font-medium">
                  Number of Images
                </Label>
                <Input
                  type="number"
                  id="n"
                  value={input.n || 1}
                  onChange={(e) => setN(parseInt(e.target.value) || 1)}
                  min={1}
                  max={10}
                />
                <p className="text-xs text-muted-foreground">
                  How many images to generate (1-10)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-sm font-medium">
                  Prompt
                </Label>
                <Textarea
                  id="prompt"
                  value={input.prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A serene landscape with mountains at sunset..."
                  className="min-h-[200px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Describe the image you want to generate
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="border-t bg-card p-4 flex justify-end">
          <Button
            type="submit"
            disabled={loading || !input.prompt.trim()}
            className="w-full"
            size="sm"
          >
            {loading ? (
              <>
                <span className="mr-2">⏳</span>
                Generating...
              </>
            ) : (
              <>
                <span className="mr-2">🎨</span>
                Generate Images
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="px-4 py-3 border-b bg-card">
          <h2 className="text-sm font-semibold">Generated Images</h2>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            {loading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                  <div className="text-4xl animate-pulse">🎨</div>
                  <p className="text-sm text-muted-foreground">
                    Generating your images...
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive font-semibold mb-2">
                  Error
                </p>
                <p className="text-sm text-destructive/90">{error}</p>
              </div>
            )}

            {output && !error && !loading && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {output.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-square relative">
                        {image.url ? (
                          <img
                            src={image.url}
                            alt={`Generated image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : image.b64_json ? (
                          <img
                            src={`data:image/png;base64,${image.b64_json}`}
                            alt={`Generated image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <p className="text-xs text-muted-foreground">
                              No image data
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="p-3 border-t">
                        <p className="text-xs text-muted-foreground">
                          Image {index + 1} of {output.images.length}
                        </p>
                        {(image.url || image.b64_json) && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href =
                                  image.url ||
                                  `data:image/png;base64,${image.b64_json}`;
                                link.download = `image-${index + 1}.png`;
                                link.click();
                              }}
                            >
                              Download
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => {
                                const url =
                                  image.url ||
                                  `data:image/png;base64,${image.b64_json}`;
                                window.open(url, "_blank");
                              }}
                            >
                              Open
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <details className="group bg-muted/50 rounded-lg p-4">
                  <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition">
                    View raw response
                  </summary>
                  <pre className="mt-2 text-xs bg-background rounded p-2 overflow-auto max-h-40">
                    {JSON.stringify(output, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {!output && !error && !loading && (
              <div className="flex items-center justify-center min-h-[400px] text-muted-foreground text-sm">
                <div className="text-center space-y-2">
                  <div className="text-3xl opacity-50">🖼️</div>
                  <p>No images generated yet.</p>
                  <p className="text-xs">
                    Enter a prompt and click "Generate Images" to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </form>
  );
};
