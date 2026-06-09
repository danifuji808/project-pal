import { useState } from 'react';
import { Toggle } from './ui';

export function RowCounter({ project, active, visibility, showCelebration, onChange, onChange2 }) {
  var [confirmReset, setConfirmReset] = useState(false);
  var rc = project.rowCounter || { current: 1, start: 1 };
  var rep = project.repeatCounter || { enabled: false, from: 1, to: 1, total: 1, current: 0 };
  var disabled = visibility === "session" && !active;
  var done = rep.enabled && rep.current >= rep.total && showCelebration;

  function setRc(patch) { onChange({ ...rc, ...patch }); }
  function setRep(patch) { onChange2({ ...rep, ...patch }); }

  function goUp() {
    if (disabled) return;
    var newRow = rc.current + 1, newRep = rep.current;
    if (rep.enabled && !done && rc.current >= rep.to) {
      newRep = rep.current + 1;
      newRow = newRep < rep.total ? rep.from : rep.to + 1;
    }
    setRc({ current: newRow });
    if (rep.enabled) setRep({ current: newRep });
  }
  function goDown() { if (disabled || rc.current <= 1) return; setRc({ current: rc.current - 1 }); }
  function doReset() { setRc({ current: rc.start || 1 }); setRep({ current: 0 }); setConfirmReset(false); }

  if (visibility === "hidden") return null;

  var inputStyle = { width: 48, padding: "3px 6px", borderRadius: 8, border: "1px solid #c19060", textAlign: "center", fontSize: 13, background: "transparent", color: "inherit", fontFamily: "inherit" };

  return (
    <div style={{ opacity: disabled ? 0.5 : 1, transition: "opacity 0.2s" }}>
      {confirmReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-warm-800 rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-warm-900 dark:text-warm-100 mb-2">Reset row counter?</h3>
            <p className="text-sm text-warm-500 dark:text-warm-400 mb-5">This will reset the row counter and clear the repeat count.</p>
            <div className="flex gap-3">
              <button type="button" onClick={doReset} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition border border-red-600">Reset</button>
              <button type="button" onClick={() => setConfirmReset(false)} className="px-4 py-2.5 rounded-xl text-sm border border-warm-300 dark:border-warm-600 text-warm-600 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-700 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-warm-500 dark:text-warm-400">Row Counter</div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setConfirmReset(true)} className="text-xs text-warm-300 dark:text-warm-600 hover:text-warm-500 dark:hover:text-warm-400 transition">Reset</button>
          <div className="flex items-center gap-1.5 text-xs text-warm-400 dark:text-warm-500">
            <span>Repeats</span>
            <Toggle value={rep.enabled} onChange={() => setRep({ enabled: !rep.enabled })}/>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="text-xs text-warm-400 dark:text-warm-500">Start</div>
          <input type="number" min="1" value={rc.start || 1} onChange={e => setRc({ start: parseInt(e.target.value) || 1, current: parseInt(e.target.value) || 1 })} className="w-16 px-2 py-1 rounded-lg border border-warm-300 dark:border-warm-600 bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 text-sm text-center focus:outline-none focus:ring-2 focus:ring-warm-400"/>
        </div>
        <div className="flex-1 flex items-center justify-center gap-4">
          <button type="button" onClick={goDown} disabled={disabled || rc.current <= 1} className={"w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all " + (disabled || rc.current <= 1 ? "border-warm-200 dark:border-warm-700 text-warm-200 dark:text-warm-700 cursor-not-allowed" : "border-warm-400 dark:border-warm-500 hover:bg-warm-100 dark:hover:bg-warm-700 text-warm-600 dark:text-warm-300 active:scale-95")}>▼</button>
          <div className="text-center">
            <div className="text-4xl font-bold font-mono text-warm-800 dark:text-warm-100">{String(rc.current).padStart(2, "0")}</div>
            <div className="text-xs text-warm-400 dark:text-warm-500 mt-1">current row</div>
          </div>
          <button type="button" onClick={goUp} disabled={disabled} className={"w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg font-bold transition-all " + (disabled ? "border-warm-200 dark:border-warm-700 text-warm-200 dark:text-warm-700 cursor-not-allowed" : "border-warm-400 dark:border-warm-500 hover:bg-warm-100 dark:hover:bg-warm-700 text-warm-600 dark:text-warm-300 active:scale-95")}>▲</button>
        </div>
      </div>

      {disabled && <div className="text-xs text-center text-warm-300 dark:text-warm-600 mb-2">Start a session to use the row counter</div>}

      {rep.enabled && (
        <div className="mt-3 pt-3 border-t border-warm-100 dark:border-warm-700">
          <div className="text-xs font-semibold uppercase tracking-widest text-warm-500 dark:text-warm-400 mb-3">Repeat Counter</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {done ? (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 18 }}>🎉</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#4caf6e" }}>All repeats complete!</div>
                      <div style={{ fontSize: 11, color: "#c19060" }}>Rows {rep.from}–{rep.to} repeated {rep.total} times</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => setRep({ enabled: true, from: 1, to: 1, total: 1, current: 0 })} style={{ fontSize: 11, color: "#c19060", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    Set up new repeat
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6, fontSize: 12, color: "#c19060" }}>
                  <span>Rows</span>
                  <input type="number" min="1" value={rep.from} onChange={e => setRep({ from: parseInt(e.target.value) || 1 })} style={inputStyle}/>
                  <span>–</span>
                  <input type="number" min="1" value={rep.to} onChange={e => setRep({ to: parseInt(e.target.value) || 1 })} style={inputStyle}/>
                  <input type="number" min="1" value={rep.total} onChange={e => setRep({ total: parseInt(e.target.value) || 1 })} style={inputStyle}/>
                  <span>times</span>
                </div>
              )}
            </div>
            <div style={{ width: 56, flexShrink: 0, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "monospace", color: done ? "#4caf6e" : "inherit" }}>
                {rep.current}<span style={{ fontSize: 15, color: "#c19060", fontWeight: 400 }}>/{rep.total}</span>
              </div>
              <div style={{ fontSize: 11, color: "#c19060" }}>repeat</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}