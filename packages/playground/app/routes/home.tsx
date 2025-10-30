import type { Route } from "./+types/home";
import { Link } from "react-router";
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
import { PlusIcon, MessageSquareIcon, ImageIcon } from "lucide-react";

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
  return (
    <div className="w-full h-full">
      <div className="border-b bg-card shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
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
                  <MessageSquareIcon />
                  Chat Completion
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/image" className="cursor-pointer">
                  <ImageIcon />
                  Image Generation
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div>
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
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-mono text-xs">{job.id}</TableCell>
                <TableCell className="capitalize">{job.provider}</TableCell>
                <TableCell className="capitalize">{job.body.type}</TableCell>
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
      </div>
    </div>
  );
}
