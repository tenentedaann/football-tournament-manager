begin;
alter table public.tournaments alter column owner_id set not null;
alter table public.tournaments enable row level security;

do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname='public' and tablename='tournaments'
  loop execute format('drop policy if exists %I on public.tournaments',p.policyname); end loop;
end $$;

revoke all on table public.tournaments from anon, authenticated;
grant select (id,slug,title,public_data,is_public,created_at) on public.tournaments to anon;
grant select,insert,update,delete on public.tournaments to authenticated;

create policy tournaments_public_read on public.tournaments for select to anon using (is_public=true);
create policy tournaments_owner_read on public.tournaments for select to authenticated using (owner_id=auth.uid());
create policy tournaments_owner_insert on public.tournaments for insert to authenticated with check (owner_id=auth.uid());
create policy tournaments_owner_update on public.tournaments for update to authenticated using (owner_id=auth.uid()) with check (owner_id=auth.uid());
create policy tournaments_owner_delete on public.tournaments for delete to authenticated using (owner_id=auth.uid());
commit;
