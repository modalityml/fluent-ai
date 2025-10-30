import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { PlusIcon, ListIcon, LayoutGridIcon } from "lucide-react";

// Sample job data following the job schema
const sampleJobs = [
  {
    id: "job-001",
    provider: "openrouter" as const,
    options: {
      apiKey: "sk-xxx",
    },
    body: {
      type: "chat" as const,
      input: {
        model: "anthropic/claude-3.5-sonnet",
        messages: [{ role: "user", content: "Hello, how are you?" }],
        temperature: 0.7,
        maxTokens: 1000,
      },
      output: {
        messages: [
          { role: "assistant", content: "I'm doing well, thank you!" },
        ],
        usage: {
          promptTokens: 450,
          completionTokens: 800,
          totalTokens: 1250,
        },
      },
    },
    status: "completed",
    createdAt: new Date("2024-10-30T10:30:00"),
    completedAt: new Date("2024-10-30T10:30:05"),
  },
  {
    id: "job-002",
    provider: "openrouter" as const,
    options: {
      apiKey: "sk-xxx",
    },
    body: {
      type: "chat" as const,
      input: {
        model: "openai/gpt-4-turbo",
        messages: [{ role: "user", content: "Explain quantum computing" }],
        temperature: 0.5,
      },
      output: {
        messages: [{ role: "assistant", content: "Quantum computing is..." }],
        usage: {
          promptTokens: 320,
          completionTokens: 570,
          totalTokens: 890,
        },
      },
    },
    status: "completed",
    createdAt: new Date("2024-10-30T09:15:00"),
    completedAt: new Date("2024-10-30T09:15:03"),
  },
  {
    id: "job-003",
    provider: "fal" as const,
    options: {
      apiKey: "fal-xxx",
    },
    body: {
      type: "image" as const,
      input: {
        model: "fal-ai/flux/dev",
        prompt: "A beautiful sunset over mountains",
        size: "1024x1024",
        n: 1,
      },
    },
    status: "running",
    createdAt: new Date("2024-10-30T11:00:00"),
    completedAt: null,
  },
  {
    id: "job-004",
    provider: "openrouter" as const,
    options: {
      apiKey: "sk-xxx",
    },
    body: {
      type: "chat" as const,
      input: {
        model: "meta-llama/llama-3.1-70b-instruct",
        messages: [{ role: "user", content: "Write a poem about AI" }],
        temperature: 0.9,
        maxTokens: 2000,
      },
      output: {
        messages: [
          {
            role: "assistant",
            content: "In circuits deep and code so bright...",
          },
        ],
        usage: {
          promptTokens: 850,
          completionTokens: 1250,
          totalTokens: 2100,
        },
      },
    },
    status: "completed",
    createdAt: new Date("2024-10-30T08:45:00"),
    completedAt: new Date("2024-10-30T08:45:04"),
  },
  {
    id: "job-005",
    provider: "openrouter" as const,
    options: {
      apiKey: "sk-xxx",
    },
    body: {
      type: "chat" as const,
      input: {
        model: "google/gemini-pro",
        messages: [{ role: "user", content: "Translate to Spanish" }],
      },
    },
    status: "failed",
    createdAt: new Date("2024-10-30T07:30:00"),
    completedAt: new Date("2024-10-30T07:30:01"),
  },
  {
    id: "job-006",
    provider: "fal" as const,
    options: {
      apiKey: "fal-xxx",
    },
    body: {
      type: "image" as const,
      input: {
        model: "fal-ai/stable-diffusion-xl",
        prompt: "A futuristic city with flying cars",
        size: "1024x1024",
        n: 1,
      },
      output: {
        images: [{ url: "https://example.com/image.png" }],
      },
    },
    status: "completed",
    createdAt: new Date("2024-10-29T16:20:00"),
    completedAt: new Date("2024-10-29T16:20:08"),
  },
];

export const loader = ({ request }: Route.LoaderArgs) => {
  return {
    jobs: sampleJobs,
  };
};

export const action = ({ request }: Route.ActionArgs) => {};

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "completed":
      return "default";
    case "running":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function calculateDuration(start: Date, end: Date | null) {
  if (!end) return "—";
  const diff = end.getTime() - start.getTime();
  const seconds = Math.floor(diff / 1000);
  return `${seconds}s`;
}

export default function Page({ loaderData: { jobs } }: Route.ComponentProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredJobs = jobs.filter((job) => {
    const providerMatch =
      selectedProvider === "all" || job.provider === selectedProvider;
    const typeMatch = selectedType === "all" || job.body.type === selectedType;
    return providerMatch && typeMatch;
  });

  return (
    <div className="w-full h-full flex">
      <div className="w-64 border-r bg-card shrink-0 overflow-y-auto">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-3">View Mode</h3>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="flex-1"
              >
                <ListIcon className="h-4 w-4" />
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="flex-1"
              >
                <LayoutGridIcon className="h-4 w-4" />
                Grid
              </Button>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-3">Provider</h3>
            <Select
              value={selectedProvider}
              onValueChange={setSelectedProvider}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="openrouter">OpenRouter</SelectItem>
                <SelectItem value="fal">Fal</SelectItem>
                <SelectItem value="voyage">Voyage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-semibold mb-3">Type</h3>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="embedding">Embedding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-card shrink-0">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <PlusIcon />
                  New Job
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Create New Job</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/chat" className="cursor-pointer">
                    Chat Completion
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/image" className="cursor-pointer">
                    Image Generation
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/embedding" className="cursor-pointer">
                    Embedding Generation
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {viewMode === "list" ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Tokens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-xs">
                      {job.id}
                    </TableCell>
                    <TableCell className="capitalize">{job.provider}</TableCell>
                    <TableCell className="capitalize">
                      {job.body.type}
                    </TableCell>
                    <TableCell className="text-xs">
                      {job.body.input.model}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatDate(job.createdAt)}
                    </TableCell>
                    <TableCell>
                      {calculateDuration(job.createdAt, job.completedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {job.body.output?.usage?.totalTokens
                        ? job.body.output.usage.totalTokens.toLocaleString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredJobs.map((job) => (
                <Card key={job.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-mono">
                        {job.id}
                      </CardTitle>
                      <Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Provider:</span>
                        <span className="capitalize">{job.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="capitalize">{job.body.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span className="text-xs">{job.body.input.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="text-xs">
                          {formatDate(job.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>
                          {calculateDuration(job.createdAt, job.completedAt)}
                        </span>
                      </div>
                      {job.body.output?.usage?.totalTokens && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tokens:</span>
                          <span>
                            {job.body.output.usage.totalTokens.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
