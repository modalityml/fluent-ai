import { z } from "zod";
import { ChatJobSchema } from "~/jobs";

export const GoogleBaseJobSchema = z.object({
  provider: z.literal("google"),
});

export const GoogleChatJobSchema = ChatJobSchema.merge(GoogleBaseJobSchema);
export type GoogleChatJob = z.infer<typeof GoogleChatJobSchema>;
