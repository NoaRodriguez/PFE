-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create the match_nutrition function
create or replace function match_nutrition (
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  filter_profil text,
  filter_horizon text
)
returns table (
  id bigint,
  content text,
  similarity float,
  metadata jsonb
)
language plpgsql
as $$
begin
  return query
  select
    nutrition.id,
    nutrition.content,
    1 - (nutrition.embedding <=> query_embedding) as similarity,
    nutrition.metadata
  from nutrition
  where 1 - (nutrition.embedding <=> query_embedding) > match_threshold
  and (
      nutrition.metadata->>'profil' = 'tous' 
      or nutrition.metadata->>'profil' = filter_profil
  )
  and (
      nutrition.metadata->>'horizon' = filter_horizon 
      or filter_horizon is null
  )
  order by nutrition.embedding <=> query_embedding
  limit match_count;
end;
$$;
