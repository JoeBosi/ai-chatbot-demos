ALTER TABLE "support_tickets" ADD COLUMN "tool_call_id" text;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_tool_call_id_unique" UNIQUE("tool_call_id");