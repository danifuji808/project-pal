import { useSwipeBack } from '../hooks/useSwipeBack';
import { buildDayMap, ms2str } from '../utils';
import { Card, Btn, Metric } from './ui';
import { MonthHeatmap } from './MonthHeatmap';

export function StatsPage({ projects, dark, onBack }) {
  useSwipeBack(onBack);

  var dm = buildDayMap(projects);
  var totalMs = projects.reduce((a, pr) => a + pr.sessions.reduce((b, s) => s.start ? b + s.duration : b, 0), 0);
  var totalSess = projects.reduce((a, pr) => a + pr.sessions.filter(s => !!s.start).length, 0);
  var top = projects.slice().sort((a, b) => {
    return b.sessions.reduce((x, s) => s.start ? x + s.duration : x, 0) -
           a.sessions.reduce((x, s) => s.start ? x + s.duration : x, 0);
  })[0];
  var topMs = top ? top.sessions.reduce((a, s) => s.start ? a + s.duration : a, 0) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Btn onClick={onBack}>← Dashboard</Btn>
        <h2 className="text-2xl font-bold text-warm-800 dark:text-warm-100 flex-1">📊 Stats</h2>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Metric label="All-time" value={totalMs > 0 ? ms2str(totalMs) : "—"}/>
        <Metric label="Total sessions" value={totalSess}/>
        <Metric label="Projects" value={projects.length}/>
      </div>
      {top && topMs > 0 && (
        <Card className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-warm-500 dark:text-warm-400 mb-1">Most time spent (all-time)</div>
          <div className="font-semibold text-warm-800 dark:text-warm-100">{top.name}</div>
          <div className="text-sm text-warm-500 dark:text-warm-400">{ms2str(topMs)}</div>
        </Card>
      )}
      <Card>
        <div className="text-xs font-semibold uppercase tracking-widest text-warm-500 dark:text-warm-400 mb-4">Activity calendar</div>
        <MonthHeatmap dm={dm} dark={dark} projects={projects}/>
      </Card>
    </div>
  );
}