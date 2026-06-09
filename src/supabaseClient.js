import { createClient } from '@supabase/supabase-js';

export const sb = createClient(
  "https://fxvzvvphfdhdrizrgfpt.supabase.co",
  "sb_publishable_txnBnVsGSQAIBizOZbHnew_Sk4seG5k"
);

export function dbLoad(uid) {
  return sb.from("projects").select("*").eq("user_id", uid)
    .then(r => r.error ? [] : r.data.map(x => x.data))
    .catch(() => []);
}

export function dbUpsert(proj, uid) {
  return sb.from("projects").upsert({ id: proj.id, user_id: uid, data: proj }, { onConflict: "id" })
    .then(r => { if (r.error) console.error("upsert:", r.error); });
}

export function dbDelete(id) {
  return sb.from("projects").delete().eq("id", id)
    .then(r => { if (r.error) console.error("delete:", r.error); });
}
