create table if not exists public.usage_daily (
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  count int not null default 0,
  primary key (user_id, date)
);

create table if not exists public.ai_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tool text not null,
  created_at timestamptz not null default now()
);

alter table public.usage_daily enable row level security;
alter table public.ai_requests enable row level security;

create policy "Users read own usage"
  on public.usage_daily for select
  using (auth.uid() = user_id);

create policy "Users read own ai requests"
  on public.ai_requests for select
  using (auth.uid() = user_id);

create policy "Users insert own usage"
  on public.usage_daily for insert
  with check (auth.uid() = user_id);

create policy "Users update own usage"
  on public.usage_daily for update
  using (auth.uid() = user_id);

create policy "Users insert own ai requests"
  on public.ai_requests for insert
  with check (auth.uid() = user_id);
