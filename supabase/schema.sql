-- ============================================================
-- CodeQuest: Схема базы данных для Supabase (PostgreSQL)
-- Скопируйте и выполните этот код в Supabase -> SQL Editor
-- ============================================================

-- 1. Таблица хранения онлайн-прогресса пользователей
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar text default '🤖',
  total_xp integer default 0,
  completed_lessons jsonb default '[]'::jsonb,
  completed_steps jsonb default '[]'::jsonb,
  skipped_lessons jsonb default '[]'::jsonb,
  solved_code integer default 0,
  earned_badges jsonb default '[]'::jsonb,
  streak_current integer default 0,
  streak_longest integer default 0,
  last_active_date text,
  streak_freezes integer default 0,
  max_unlocked_index integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Включаем Row Level Security (RLS)
alter table public.user_progress enable row level security;

-- 3. Политики безопасности (каждый пользователь управляет только своим прогрессом)
drop policy if exists "Пользователь читает свой прогресс" on public.user_progress;
create policy "Пользователь читает свой прогресс"
  on public.user_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Пользователь создает свой прогресс" on public.user_progress;
create policy "Пользователь создает свой прогресс"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Пользователь обновляет свой прогресс" on public.user_progress;
create policy "Пользователь обновляет свой прогресс"
  on public.user_progress for update
  using (auth.uid() = user_id);
