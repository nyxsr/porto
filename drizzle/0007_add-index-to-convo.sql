CREATE INDEX "convo_sid_idx" ON "convo" USING btree ("sid");--> statement-breakpoint
CREATE INDEX "convo_sid_created_idx" ON "convo" USING btree ("sid","created_at");