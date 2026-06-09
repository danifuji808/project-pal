import { useRef, useEffect } from 'react';
import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { dkey, ms2str } from '../utils';

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Tooltip);

export function ProjectChart({ project, dark }) {
  var ref = useRef(null), chart = useRef(null);
  var sessions = project.sessions;
  var sessKey = sessions.map(s => s.id + s.duration).join(",");

  useEffect(() => {
    var dm = {};
    sessions.forEach(s => {
      if (!s.start) return;
      var k = dkey(s.start);
      dm[k] = (dm[k] || 0) + s.duration;
    });
    var keys = Object.keys(dm).sort();
    if (!keys.length) return;

    var days = [];
    var s0 = new Date(keys[0] + "T12:00:00"), se = new Date(keys[keys.length - 1] + "T12:00:00");
    for (var d = new Date(s0); d <= se; d.setDate(d.getDate() + 1)) {
      var k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      days.push({ label: new Date(k + "T12:00:00").toLocaleDateString([], { month: "short", day: "numeric" }), mins: Math.round((dm[k] || 0) / 60000) });
    }

    var tc = dark ? "#d4b48a" : "#8a5530", gc = dark ? "#4f2d1640" : "#e8d5b840";
    if (chart.current) chart.current.destroy();
    chart.current = new Chart(ref.current.getContext("2d"), {
      type: "line",
      data: {
        labels: days.map(d => d.label),
        datasets: [{
          label: "Minutes",
          data: days.map(d => d.mins),
          borderColor: "#4caf6e",
          backgroundColor: "rgba(76,175,110,0.12)",
          borderWidth: 2.5,
          pointBackgroundColor: days.map(d => d.mins > 0 ? "#4caf6e" : "transparent"),
          pointBorderColor: days.map(d => d.mins > 0 ? "#4caf6e" : "transparent"),
          pointRadius: days.map(d => d.mins > 0 ? 4 : 0),
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => ms2str(c.parsed.y * 60000) } }
        },
        scales: {
          x: { ticks: { color: tc, maxRotation: 45, font: { size: 11 } }, grid: { color: gc } },
          y: { beginAtZero: true, ticks: { color: tc, font: { size: 11 }, callback: v => v + "m" }, grid: { color: gc } }
        }
      }
    });
    return () => { if (chart.current) chart.current.destroy(); };
  }, [sessKey, dark]);

  var realSess = sessions.filter(s => s.start);
  if (!realSess.length) return <div className="text-sm text-warm-400 dark:text-warm-500 py-4 text-center">No sessions logged yet.</div>;

  var durs = realSess.map(s => s.duration);
  var avg = durs.reduce((a, b) => a + b, 0) / durs.length;
  var max = Math.max(...durs);
  var bm = {};
  realSess.forEach(s => { var k = dkey(s.start); bm[k] = (bm[k] || 0) + s.duration; });
  var bd = Object.keys(bm).reduce((a, b) => bm[b] > bm[a] ? b : a);

  return (
    <div>
      <canvas ref={ref} style={{ maxHeight: 200 }}/>
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-warm-100 dark:bg-warm-700 rounded-xl p-2 text-center">
          <div className="text-sm font-bold text-warm-800 dark:text-warm-100">{ms2str(avg)}</div>
          <div className="text-xs text-warm-500 dark:text-warm-400">avg session</div>
        </div>
        <div className="bg-warm-100 dark:bg-warm-700 rounded-xl p-2 text-center">
          <div className="text-sm font-bold text-warm-800 dark:text-warm-100">{ms2str(max)}</div>
          <div className="text-xs text-warm-500 dark:text-warm-400">longest</div>
        </div>
        <div className="bg-warm-100 dark:bg-warm-700 rounded-xl p-2 text-center">
          <div className="text-sm font-bold text-warm-800 dark:text-warm-100">{new Date(bd + "T12:00:00").toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</div>
          <div className="text-xs text-warm-500 dark:text-warm-400">best day</div>
        </div>
      </div>
    </div>
  );
}