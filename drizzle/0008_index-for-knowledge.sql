CREATE INDEX "knowledge_embedding_hnsw_idx" ON "knowledge" USING hnsw ("embedding" vector_cosine_ops) WITH (m=16,ef_construction=64);--> statement-breakpoint
CREATE INDEX "knowledge_title_content_search_idx" ON "knowledge" USING gin (to_tsvector('english', "title" || ' ' || "content"));--> statement-breakpoint
CREATE INDEX "knowledge_keywords_gin_idx" ON "knowledge" USING gin ("keywords");--> statement-breakpoint
CREATE INDEX "knowledge_meta_lang_idx" ON "knowledge" USING btree (((meta->>'lang')));--> statement-breakpoint
CREATE INDEX "knowledge_meta_tags_gin_idx" ON "knowledge" USING gin (((meta->'tags')));--> statement-breakpoint
CREATE INDEX "knowledge_meta_source_idx" ON "knowledge" USING btree (((meta->>'source')));--> statement-breakpoint
CREATE INDEX "knowledge_lang_source_idx" ON "knowledge" USING btree (((meta->>'lang')),((meta->>'source')));--> statement-breakpoint
CREATE INDEX "knowledge_recent_by_lang_idx" ON "knowledge" USING btree (((meta->>'lang')),"updatedAt" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "knowledge_updated_at_idx" ON "knowledge" USING btree ("updatedAt" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "knowledge_created_at_idx" ON "knowledge" USING btree ("createdAt" DESC NULLS LAST);