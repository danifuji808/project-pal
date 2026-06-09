import { DAYLABELS } from '../constants';
import { ms2str } from '../utils';

export function WeekStrip({ dm, onStats }) {
  var today = new Date(), dow = today.getDay();
  var sun = new Date(today);
  sun.setDate(today.getDate() - dow);

  var days = [];
  for (var i = 0; i < 7; i++) {
    var d = new Date(sun);
    d.setDate(sun.getDate() + i);
    var k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    var mins = Math.round((dm[k] || 0) / 60000);
    days.push({ label: DAYLABELS[i], date: (d.getMonth() + 1) + "/" + d.getDate(), mins, today: d.toDateString() === today.toDateString() });
  }

  return (
    <div className="flex items-center gap-1.5 mb-6 cursor-pointer" onClick={onStats}>
      {days.map((d, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-0.5">
          <div className={"text-xs font-medium " + (d.today ? "text-warm-700 dark:text-warm-200 font-bold" : "text-warm-400 dark:text-warm-500")}>{d.label}</div>
          <div className="text-warm-300 dark:text-warm-600" style={{ fontSize: 9 }}>{d.date}</div>
          <div className="flex items-center justify-center w-full" style={{ height: 18 }}>
            {d.mins > 0
              ? <div className="rounded-full bg-emerald-400 dark:bg-emerald-500" style={{ width: 8, height: 8 }}/>
              : <div className="rounded-full border border-warm-200 dark:border-warm-700" style={{ width: 8, height: 8 }}/>
            }
          </div>
          {d.mins > 0 && <div className="text-warm-500 dark:text-warm-400" style={{ fontSize: 9 }}>{ms2str(d.mins * 60000)}</div>}
        </div>
      ))}
    </div>
  );
}
