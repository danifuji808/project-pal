import { useState, useEffect } from 'react';
import { useSwipeBack } from '../hooks/useSwipeBack';
import { totalTime, ms2str, ms2clock, fmtDate, uid } from '../utils';
import { Card, Btn, Metric, RowItem, StatusBtns } from './ui';
import { RowCounter } from './RowCounter';
import { TodoList } from './TodoList';
import { ProjectChart } from './ProjectChart';

export function DetailView({ project, dark, settings, onBack, onEdit, onDelete, onStart, onStop, onAddNote, onDeleteNote, onStatusChange, onDeleteSession, onTodosChange, onRowCounterChange, onRepeatCounterChange }) {
  useSwipeBack(onBack);
  var [noteInp, setNoteInp] = useState("");
  var [showStats, setShowStats] = useState(true);
  var [, tick] = useState(0);

  useEffect(() => {
    var iv = setInterval(() => tick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  var pr = project, run = !!pr.activeSession, t = totalTime(pr);
  var yarns = pr.yarns || [];
  var gt = yarns.reduce((a, y) => a + (parseFloat(y.amountPerSkein) || 0) * (parseFloat(y.numSkeins) || 0), 0);
  var gu = yarns.length === 1
    ? (yarns[0].unit || "yards")
    : (yarns.every(y => (y.unit || "yards") === "meters") ? "meters" : "yards");

  function addNote() {
    if (noteInp.trim()) { onAddNote(noteInp.trim()); setNoteInp(""); }
  }

  var vis = settings ? settings.rowCounterVisibility : "visible";
  var layout = settings ? settings.cardLayout : "default";
  var showCelebration = settings ? settings.celebrationEnabled !== false : true;

  var timerCard = (
    <Card className="mb-5">
      <div className="flex flex-col sm:flex-row sm:gap-6">
        {vis !== "hidden" && (
          <div className="sm:flex-1 sm:border-r sm:border-warm-100 sm:dark:border-warm-700 sm:pr-6 mb-4 sm:mb-0">
            <RowCounter
              project={pr} active={run} visibility={vis} showCelebration={showCelebration}
              onChange={onRowCounterChange} onChange2={onRepeatCounterChange}
            />
          </div>
        )}
        <div className={vis !== "hidden" ? "sm:w-48 flex flex-col justify-center" : ""}>
          <h3 className="text-sm font-semibold text-warm-700 dark:text-warm-300 mb-4">Time tracker</h3>
          {run && (
            <div className="mb-4">
              <div className="text-4xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-widest">
                {ms2clock(Date.now() - new Date(pr.activeSession.start))}
              </div>
              <div className="text-xs text-warm-400 mt-1">Started {new Date(pr.activeSession.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          )}
          <Btn variant={run ? "running" : "primary"} onClick={run ? onStop : onStart} className="w-full py-2.5">
            {run ? "⏹ Stop session" : "▶ Start session"}
          </Btn>
        </div>
      </div>
    </Card>
  );

  var infoCard = (
    <Card>
      <div className="text-xs font-semibold uppercase tracking-widest text-warm-500 dark:text-warm-400 mb-3">Project info</div>
      {pr.pattern && <RowItem label="Pattern" value={pr.patternUrl ? <a href={pr.patternUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-medium">{pr.pattern} ↗</a> : pr.pattern}/>}
      {pr.size && <RowItem label="Size" value={pr.size}/>}
      {pr.needleSizes && pr.needleSizes.length > 0 && <RowItem label="Needle/hook" value={pr.needleSizes.join(", ")}/>}
      {yarns.map((y, i) => {
        var sub = (parseFloat(y.amountPerSkein) || 0) * (parseFloat(y.numSkeins) || 0);
        return (
          <div key={y.id || i}>
            {yarns.length > 1 && <div className="text-xs font-semibold text-warm-400 uppercase tracking-wider pt-3 pb-1">Yarn {i + 1}</div>}
            {(y.brand || y.name) && <RowItem label="Yarn" value={[y.brand, y.name].filter(Boolean).join(" · ")}/>}
            {y.colorway && <RowItem label="Colorway" value={y.colorway}/>}
            {y.dyeLot && <RowItem label="Dye lot" value={y.dyeLot}/>}
            {y.amountPerSkein && <RowItem label={(y.unit || "yards") + "/skein"} value={parseFloat(y.amountPerSkein).toLocaleString()}/>}
            {y.numSkeins && <RowItem label="Skeins" value={y.numSkeins}/>}
            {sub > 0 && <RowItem label="Subtotal" value={sub.toLocaleString() + " " + (y.unit || "yards")}/>}
          </div>
        );
      })}
      {yarns.length > 1 && gt > 0 && <RowItem label={"Total " + gu} value={gt.toLocaleString()} bold/>}
    </Card>
  );

  var statsCard = (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-warm-500 dark:text-warm-400">📈 Stats</div>
        <Btn variant="ghost" onClick={() => setShowStats(s => !s)} className="text-xs px-2 py-1">{showStats ? "Hide" : "Show"}</Btn>
      </div>
      {showStats
        ? <ProjectChart project={pr} dark={dark}/>
        : <div className="text-xs text-warm-400 dark:text-warm-500">Tap show to view chart & session stats.</div>
      }
    </Card>
  );

  var todosCard = (
    <Card>
      <div className="text-xs font-semibold uppercase tracking-widest text-warm-500 dark:text-warm-400 mb-3">To-do</div>
      <TodoList todos={pr.todos || []} onChange={onTodosChange}/>
    </Card>
  );

  var notesCard = (
    <Card>
      <div className="text-xs font-semibold uppercase tracking-widest text-warm-500 dark:text-warm-400 mb-3">Notes</div>
      <div className="flex gap-2 mb-4">
        <textarea id="note-inp" value={noteInp} onChange={e => setNoteInp(e.target.value)} placeholder="Log a note, hiccup, or frog moment…" rows={2} className="flex-1 px-3 py-2 rounded-xl border border-warm-300 dark:border-warm-600 bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 text-sm focus:outline-none focus:ring-2 focus:ring-warm-400 dark:focus:ring-warm-500 transition placeholder-warm-400 dark:placeholder-warm-500 resize-none" onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addNote(); } }}/>
        <Btn onClick={addNote} className="self-end">Add</Btn>
      </div>
      {pr.notes.length === 0 && <p className="text-sm text-warm-300 dark:text-warm-600">No notes yet.</p>}
      {pr.notes.slice().reverse().map(n => (
        <div key={n.id} className="border-t border-warm-100 dark:border-warm-700 pt-3 pb-2">
          <div className="flex justify-between items-start mb-1">
            <span className="text-xs text-warm-300 dark:text-warm-600">{fmtDate(n.ts)}</span>
            <button type="button" onClick={() => onDeleteNote(n.id)} className="text-warm-300 dark:text-warm-600 hover:text-red-500 dark:hover:text-red-400 transition text-base leading-none px-1">×</button>
          </div>
          <div className="text-sm leading-relaxed text-warm-800 dark:text-warm-200" style={{ whiteSpace: "pre-wrap" }}>{n.text}</div>
        </div>
      ))}
    </Card>
  );

  var sessCard = pr.sessions.length > 0 && (
    <Card>
      <div className="text-xs font-semibold uppercase tracking-widest text-warm-500 dark:text-warm-400 mb-3">Session history</div>
      {pr.sessions.slice().reverse().map(s => (
        <div key={s.id} className="flex justify-between items-center text-xs text-warm-500 dark:text-warm-400 py-2 border-b border-warm-100 dark:border-warm-700 last:border-0">
          <span>{s.start ? fmtDate(s.start) : "Prior time (imported)"}</span>
          <div className="flex items-center gap-2">
            <span>{ms2str(s.duration)}</span>
            <button type="button" onClick={() => onDeleteSession(s.id)} className="text-warm-300 dark:text-warm-600 hover:text-red-500 dark:hover:text-red-400 transition text-base leading-none px-1">×</button>
          </div>
        </div>
      ))}
    </Card>
  );

  function desktopLayout() {
    if (layout === "working") return (
      <div>
        <div className="grid grid-cols-2 gap-5 mb-5">{todosCard}{notesCard}</div>
        <div className="grid grid-cols-2 gap-5 mb-5">{infoCard}{statsCard}</div>
        {sessCard && <div className="mb-5">{sessCard}</div>}
      </div>
    );
    if (layout === "overview") return (
      <div>
        <div className="grid grid-cols-2 gap-5 mb-5">{infoCard}{statsCard}</div>
        <div className="grid grid-cols-2 gap-5 mb-5">{todosCard}{notesCard}</div>
        {sessCard && <div className="mb-5">{sessCard}</div>}
      </div>
    );
    return (
      <div>
        <div className="grid grid-cols-2 gap-5 mb-5">{infoCard}{statsCard}</div>
        <div className="grid grid-cols-2 gap-5 mb-5">{todosCard}{notesCard}</div>
        {sessCard && <div className="mb-5">{sessCard}</div>}
      </div>
    );
  }

  function mobileLayout() {
    if (layout === "working") return <div className="space-y-5">{todosCard}{notesCard}{infoCard}{statsCard}{sessCard && <div>{sessCard}</div>}</div>;
    if (layout === "overview") return <div className="space-y-5">{infoCard}{statsCard}{todosCard}{notesCard}{sessCard && <div>{sessCard}</div>}</div>;
    return <div className="space-y-5">{todosCard}{notesCard}{infoCard}{statsCard}{sessCard && <div>{sessCard}</div>}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Btn onClick={onBack}>← Dashboard</Btn>
        <div className="flex-1"/>
        <Btn onClick={onEdit}>Edit</Btn>
        <Btn variant="danger" onClick={onDelete}>Delete</Btn>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-warm-900 dark:text-warm-100">{pr.name}</h2>
        <p className="text-sm text-warm-500 dark:text-warm-400 mt-1">{pr.craft} · {pr.type}{pr.recipient ? " · For " + pr.recipient : ""}</p>
        <div className="mt-3"><StatusBtns current={pr.status} onChange={onStatusChange}/></div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <Metric label="Total time" value={t > 0 ? ms2str(t) : "0m"} accent={run}/>
        <Metric label="Sessions" value={pr.sessions.length + (run ? 1 : 0)}/>
      </div>
      {timerCard}
      <div className="hidden md:block">{desktopLayout()}</div>
      <div className="md:hidden">{mobileLayout()}</div>
    </div>
  );
}