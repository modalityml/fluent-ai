import { z } from "zod";
import { ChatJobSchema } from "~/jobs/chat";

export const GoogleBaseJobSchema = z.object({
  provider: z.literal("google"),
});

export const GoogleChatJobSchema = ChatJobSchema.extend(GoogleBaseJobSchema);

export const GoogleJobSchema = z.discriminatedUnion("type", [
  GoogleChatJobSchema,
]);

export type GoogleJob = z.infer<typeof GoogleJobSchema>;
export type GoogleChatJob = z.infer<typeof GoogleChatJobSchema>;
