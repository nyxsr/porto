-- Custom SQL migration file, put your code below! --

-- Enable vector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Vector similarity search index (HNSW - optimal for 1536 dimensions)
-- HNSW performs better than IVFFlat for high-dimensional vectors
CREATE INDEX IF NOT EXISTS knowledge_embedding_hnsw_idx
ON knowledge USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 2. Full-text search index for title and content
-- Enables fast semantic text search across both fields
CREATE INDEX IF NOT EXISTS knowledge_title_content_search_idx
ON knowledge USING gin(to_tsvector('english', title || ' ' || content));

-- 3. GIN index for keywords array operations
-- Essential for tag-based filtering with @>, &&, <@ operators
CREATE INDEX IF NOT EXISTS knowledge_keywords_gin_idx
ON knowledge USING gin(keywords);

-- 4. JSONB indexes for meta fields (based on your data patterns)
CREATE INDEX IF NOT EXISTS knowledge_meta_lang_idx
ON knowledge ((meta->>'lang'));

CREATE INDEX IF NOT EXISTS knowledge_meta_tags_gin_idx
ON knowledge USING gin((meta->'tags'));

CREATE INDEX IF NOT EXISTS knowledge_meta_source_idx
ON knowledge ((meta->>'source'));

-- 5. Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS knowledge_lang_source_idx
ON knowledge ((meta->>'lang'), (meta->>'source'));

-- For retrieving recent content by language
CREATE INDEX IF NOT EXISTS knowledge_recent_by_lang_idx
ON knowledge ((meta->>'lang'), "updatedAt" DESC);

-- 6. Timestamp indexes for time-based queries
CREATE INDEX IF NOT EXISTS knowledge_updated_at_idx
ON knowledge ("updatedAt" DESC);

CREATE INDEX IF NOT EXISTS knowledge_created_at_idx
ON knowledge ("createdAt" DESC);

-- 7. Partial indexes for performance optimization
-- Index only entries with embeddings (most vector queries need this)
CREATE INDEX IF NOT EXISTS knowledge_has_embedding_idx
ON knowledge (id)
WHERE embedding IS NOT NULL;

-- Index for general fallback entries
CREATE INDEX IF NOT EXISTS knowledge_general_fallback_idx
ON knowledge ((meta->>'lang'))
WHERE (meta->>'allowGeneralFallback')::boolean = true;

-- 8. Alternative vector index for different use cases (optional)
-- IVFFlat can be better for smaller datasets or when you need faster builds
-- Uncomment if you want both options available
/*
CREATE INDEX IF NOT EXISTS knowledge_embedding_ivfflat_idx
ON knowledge USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
*/

-- 9. Multi-language text search support (optional)
-- For when you have content in different languages
-- Uncomment and modify based on your supported languages
/*
CREATE INDEX IF NOT EXISTS knowledge_title_multilang_search_idx
ON knowledge USING gin(
  CASE WHEN meta->>'lang' = 'id'
       THEN to_tsvector('indonesian', title || ' ' || content)
       ELSE to_tsvector('english', title || ' ' || content)
  END
);
*/

-- 10. Version-aware queries (if you frequently query by version)
-- Uncomment if you need version-based filtering
/*
CREATE INDEX IF NOT EXISTS knowledge_lang_version_idx
ON knowledge ((meta->>'lang'), (meta->>'version'));
*/
