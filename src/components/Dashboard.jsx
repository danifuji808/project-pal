import { useState, useEffect } from 'react';
import { SS, STATUS } from '../constants';
import { buildDayMap, sortProjects, totalTime, ms2str, relDate } from '../utils';
import { Card, Btn } from './ui';
import { WeekStrip } from './WeekStrip';

export function Dashboard({ projects, loading, dark, onToggleDark, onNew, onOpen, onNav, onSignOut }) {
  var [filter, setFilter] = useState("All");
  var [, tick] = useState(0);

  useEffect(() => {
    var iv = setInterval(() => tick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  var dm = buildDayMap(projects);
  var sorted = sortProjects(projects);
  var shown = filter === "All" ? sorted : sorted.filter(pr => pr.status === filter);

  return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        {projects.length > 0 && <WeekStrip dm={dm} onStats={() => onNav("stats")}/>}

        <div className="flex flex-wrap items-center gap-2 mb-2">
        {["All"].concat(STATUS).map(s => {
          var st = SS[s], sel = filter === s;
          if (s === "All") return (
            <button key="All" type="button" onClick={() => setFilter("All")} className={"px-4 py-1.5 rounded-xl text-sm border-2 font-medium transition-all focus:outline-none " + (sel ? "border-warm-500 bg-warm-200 dark:bg-warm-700 dark:border-warm-400 font-bold text-warm-800 dark:text-warm-100" : "border-warm-300 dark:border-warm-600 bg-transparent text-warm-600 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-700")}>
              All
            </button>
          );
          return (
            <button key={s} type="button" onClick={() => setFilter(s)} className={"px-4 py-1.5 rounded-xl text-sm border-2 font-medium transition-all focus:outline-none active:scale-95 " + st.border + " " + st.text + " " + (sel ? st.sel + " font-bold" : "bg-transparent")}>
              {s}
            </button>
          );
        })}
        <div className="ml-auto">
          <Btn variant="primary" onClick={onNew}>+ New project</Btn>
        </div>
      </div>

      <p className="text-sm text-warm-500 dark:text-warm-400 mb-6">
        {loading ? "Loading…" : projects.length + " project" + (projects.length !== 1 ? "s" : "")}
      </p>

      {loading && <div className="text-center py-16 text-warm-400">Loading your projects…</div>}
      {!loading && shown.length === 0 && (
        <div className="text-center py-16 text-warm-400 text-sm">
          {projects.length === 0 ? "No projects yet. Add your first one!" : "No projects with this status."}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {shown.map(pr => {
          var run = !!pr.activeSession, t = totalTime(pr);
          var last = pr.sessions.length > 0 ? pr.sessions[pr.sessions.length - 1] : null;
          return (
            <Card key={pr.id} onClick={() => onOpen(pr)} className={"cursor-pointer hover:shadow-md transition-shadow " + (run ? "ring-2 ring-emerald-400 dark:ring-emerald-600" : "")}>
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="font-semibold text-base leading-snug text-warm-900 dark:text-warm-100">{pr.name || "Untitled"}</div>
                <span className={"text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap " + SS[pr.status].bg + " " + SS[pr.status].text}>{pr.status}</span>
              </div>
              <div className="text-xs text-warm-500 dark:text-warm-400 mb-2 flex items-center gap-1.5">
                <span className="bg-warm-100 dark:bg-warm-700 rounded px-1.5 py-0.5 font-mono font-bold">{pr.craft === "Knit" ? "K" : pr.craft === "Crochet" ? "C" : "T"}</span>
                {pr.type}
              </div>
              {pr.pattern && <div className="text-xs text-warm-400 dark:text-warm-500 mb-1">Pattern: {pr.pattern}</div>}
              {pr.recipient && <div className="text-xs text-warm-400 dark:text-warm-500 mb-1">For: {pr.recipient}</div>}
              {run
                ? <div className="text-xs mt-3 font-medium text-emerald-600 dark:text-emerald-400">● {ms2str(t)} · session running</div>
                : last && last.start
                  ? <div className="mt-3"><div className="text-xs font-medium text-warm-500 dark:text-warm-400">{ms2str(last.duration)} · {relDate(last.start)}</div><div className="text-xs text-warm-300 dark:text-warm-600">{t > 0 ? "Total: " + ms2str(t) : ""}</div></div>
                  : <div className="text-xs mt-3 text-warm-300 dark:text-warm-600">No time logged</div>
              }
            </Card>
          );
        })}
      </div>
    </div>
  );
}