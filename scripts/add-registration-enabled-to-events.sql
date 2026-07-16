alter table public.events
add column if not exists registration_enabled boolean not null default true;
