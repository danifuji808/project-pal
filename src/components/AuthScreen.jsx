import { useState } from 'react';
import { sb } from '../supabaseClient';
import { Card, Btn, Fld, DarkBtn } from './ui';

export function AuthScreen({ dark, onToggleDark, onGuest }) {
  var [mode, setMode] = useState("login");
  var [email, setEmail] = useState("");
  var [pw, setPw] = useState("");
  var [err, setErr] = useState("");
  var [msg, setMsg] = useState("");
  var [busy, setBusy] = useState(false);

  function submit() {
    setErr(""); setMsg(""); setBusy(true);
    if (mode === "login") {
      sb.auth.signInWithPassword({ email, password: pw })
        .then(r => { setBusy(false); if (r.error) setErr(r.error.message); });
    } else {
      sb.auth.signUp({ email, password: pw })
        .then(r => { setBusy(false); if (r.error) setErr(r.error.message); else setMsg("Check your email for a confirmation link!"); });
    }
  }

  function reset() {
    setErr(""); setMsg(""); setBusy(true);
    sb.auth.resetPasswordForEmail(email, { redirectTo: "https://daniyarntracker.netlify.app" })
      .then(r => { setBusy(false); if (r.error) setErr(r.error.message); else setMsg("Password reset email sent!"); });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🧶</div>
          <h1 className="text-2xl font-bold text-warm-800 dark:text-warm-100">Project Pal</h1>
          <p className="text-sm text-warm-500 dark:text-warm-400 mt-1">Your crafting companion</p>
        </div>
        <Card>
          <div className="flex gap-2 mb-6">
            {["login","signup"].map(m => (
              <button key={m} type="button" onClick={() => { setMode(m); setErr(""); setMsg(""); }} className={"flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all " + (mode === m ? "border-warm-500 bg-warm-100 dark:bg-warm-700 dark:border-warm-400 text-warm-800 dark:text-warm-100 font-bold" : "border-transparent text-warm-500 dark:text-warm-400 hover:bg-warm-50 dark:hover:bg-warm-700")}>
                {m === "login" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <Fld id="auth-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address"/>
            <Fld id="auth-pw" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Password" onKeyDown={e => { if (e.key === "Enter") submit(); }}/>
          </div>
          {err && <div className="mt-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 rounded-xl px-3 py-2">{err}</div>}
          {msg && <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 rounded-xl px-3 py-2">{msg}</div>}
          <Btn variant="primary" onClick={submit} className="w-full mt-4 py-2.5" disabled={busy}>
            {busy ? "Please wait…" : (mode === "login" ? "Sign in" : "Create account")}
          </Btn>
          {mode === "login" && (
            <button type="button" onClick={reset} className="w-full mt-3 text-xs text-warm-400 dark:text-warm-500 hover:text-warm-600 dark:hover:text-warm-300 transition">
              Forgot password?
            </button>
          )}
          <div className="mt-4 pt-4 border-t border-warm-100 dark:border-warm-700">
            <button type="button" onClick={onGuest} className="w-full text-xs text-warm-400 dark:text-warm-500 hover:text-warm-600 dark:hover:text-warm-300 transition py-1">
              Just browsing? Try as guest →
            </button>
          </div>
        </Card>
        <div className="text-center mt-4">
          <DarkBtn dark={dark} onClick={onToggleDark}/>
        </div>
      </div>
    </div>
  );
}
