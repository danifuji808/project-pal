import { useState } from 'react';
import { MONTHS, DAYLABELS } from '../constants';
import { heat, ms2str, dkey } from '../utils';

export function MonthHeatmap({ dm, dark, projects }) {
  var [off, setOff] = useState(0);
  var now = new Date();
  var tgt = new Date(now.getFullYear(), now.getMonth() - off, 1);
  var yr = tgt.getFullYear(), mo = tgt.getMonth();
  var fd = new Date(yr, mo, 1).getDay(), dim = new Date(yr, mo + 1, 0).getDate();

  var cells = [];
  for (var i = 0; i < fd; i++) cells.push(null);
  for (var d = 1; d <= dim; d++) {
    var k = yr + "-" + String(mo + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    var mins = Math.round((dm[k] || 0) / 60000);
    cells.push({ d, k, mins, today: new Date(yr, mo, d).toDateString() === now.toDateString() });
  }

  var active = cells.filter(c => c && c.mins > 0);
  var totalMins = cells.filter(c => c).reduce((a, c) => a + c.mins, 0);
  var best = active.reduce((a, c) => (!a || c.mins > a.mins) ? c : a, null);

  var monthSess = [], mpm = {};
  projects.forEach(pr => {
    pr.sessions.forEach(s => {
      if (!s.start) return;
      var sd = new Date(s.start);
      if (sd.getFullYear() === yr && sd.getMonth() === mo) {
        monthSess.push(s);
        mpm[pr.name] = (mpm[pr.name] || 0) + s.duration;
      }
    });
  });

  var topName = Object.keys(mpm).length > 0 ? Object.keys(mpm).reduce((a, b) => mpm[b] > mpm[a] ? b : a) : null;
  var avgSess = monthSess.length > 0 ? monthSess.reduce((a, s) => a + s.duration, 0) / monthSess.length : 0;
  var maxSess = monthSess.length > 0 ? Math.max(...monthSess.map(s => s.duration)) : 0;

  var streak = 0;
  for (var si = 0; ; si++) {
    var sd2 = new Date(now);
    sd2.setDate(now.getDate() - si);
    var sk = sd2.getFullYear() + "-" + String(sd2.getMonth() + 1).padStart(2, "0") + "-" + String(sd2.getDate()).padStart(2, "0");
    if ((dm[sk] || 0) > 0) streak++;
    else break;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={() => setOff(o => o + 1)} className="p-2 rounded-xl border border-transparent hover:bg-warm-100 dark:hover:bg-warm-700 text-warm-600 dark:text-warm-400 transition">←</button>
        <span className="font-semibold text-warm-800 dark:text-warm-200">{MONTHS[mo]} {yr}</span>
        <button type="button" onClick={() => setOff(o => Math.max(0, o - 1))} className={"p-2 rounded-xl border border-transparent hover:bg-warm-100 dark:hover:bg-warm-700 text-warm-600 dark:text-warm-400 transition" + (off === 0 ? " opacity-30 pointer-events-none" : "")}>→</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYLABELS.map((l, i) => <div key={i} className="text-center text-xs font-semibold text-warm-400 dark:text-warm-500">{l}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (!c) return <div key={i}/>;
          return (
            <div key={i} className="aspect-square rounded-lg flex items-center justify-center relative group cursor-default" style={{ background: heat(c.mins, dark), outline: c.today ? "2px solid #a87040" : "none", outlineOffset: 1 }}>
              <span className="text-xs font-medium" style={{ color: c.mins >= 60 ? "#fff" : "#5a3a1a", opacity: 0.8 }}>{c.d}</span>
              {c.mins > 0 && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-warm-900 dark:bg-warm-100 text-warm-100 dark:text-warm-900 text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {ms2str(c.mins * 60000)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-3 justify-end">
        {[[0,"None"],[15,"<30m"],[45,"<1h"],[90,"<2h"],[150,"2h+"]].map(x => (
          <span key={x[0]} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ background: heat(x[0], dark), border: x[0] === 0 ? "1px solid #d4b48a" : "none" }}/>
            <span className="text-xs text-warm-400">{x[1]}</span>
          </span>
        ))}
      </div>

      {active.length === 0 && <div className="text-sm text-warm-400 dark:text-warm-500 text-center mt-5">No sessions logged this month.</div>}

      {active.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-warm-100 dark:bg-warm-700 rounded-2xl p-3 text-center">
              <div className="text-xl font-bold text-warm-800 dark:text-warm-100">{streak}</div>
              <div className="text-xs text-warm-500 dark:text-warm-400">day streak 🔥</div>
            </div>
            <div className="bg-warm-100 dark:bg-warm-700 rounded-2xl p-3 text-center">
              <div className="text-xl font-bold text-warm-800 dark:text-warm-100">{active.length}</div>
              <div className="text-xs text-warm-500 dark:text-warm-400">active days</div>
            </div>
            <div className="bg-warm-100 dark:bg-warm-700 rounded-2xl p-3 text-center">
              <div className="text-xl font-bold text-warm-800 dark:text-warm-100">{totalMins > 0 ? ms2str(totalMins * 60000) : "—"}</div>
              <div className="text-xs text-warm-500 dark:text-warm-400">this month</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-warm-100 dark:bg-warm-700 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-warm-800 dark:text-warm-100">{avgSess > 0 ? ms2str(avgSess) : "—"}</div>
              <div className="text-xs text-warm-500 dark:text-warm-400">avg session</div>
            </div>
            <div className="bg-warm-100 dark:bg-warm-700 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-warm-800 dark:text-warm-100">{maxSess > 0 ? ms2str(maxSess) : "—"}</div>
              <div className="text-xs text-warm-500 dark:text-warm-400">longest session</div>
            </div>
            <div className="bg-warm-100 dark:bg-warm-700 rounded-2xl p-3 text-center">
              <div className="text-lg font-bold text-warm-800 dark:text-warm-100">{best ? new Date(yr, mo, best.d).toLocaleDateString([], { month: "short", day: "numeric" }) : "—"}</div>
              <div className="text-xs text-warm-500 dark:text-warm-400">most active day{best ? " · " + ms2str(best.mins * 60000) : ""}</div>
            </div>
          </div>
          {topName && (
            <div className="bg-warm-100 dark:bg-warm-700 rounded-2xl p-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-warm-500 dark:text-warm-400 mb-1">Top project this month</div>
              <div className="font-semibold text-warm-800 dark:text-warm-100">{topName}</div>
              <div className="text-sm text-warm-500 dark:text-warm-400">{ms2str(mpm[topName])}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}