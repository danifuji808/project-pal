import { STATUS, SS } from '../constants';

export function Card({ className, style, onClick, children }) {
  return (
    <div className={"bg-white dark:bg-warm-800 rounded-2xl shadow-sm border border-warm-200 dark:border-warm-700 p-5 " + (className || "")} style={style} onClick={onClick}>
      {children}
    </div>
  );
}

export function Btn({ variant, className, onClick, disabled, children }) {
  var base = "inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border focus:outline-none active:scale-95 ";
  var v = {
    default: "border-warm-300 dark:border-warm-600 bg-white dark:bg-warm-800 hover:bg-warm-100 dark:hover:bg-warm-700 text-warm-800 dark:text-warm-200",
    primary: "border-warm-600 dark:border-warm-400 bg-warm-600 dark:bg-warm-500 hover:bg-warm-700 dark:hover:bg-warm-400 text-white font-semibold",
    danger:  "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 text-red-700 dark:text-red-300",
    running: "border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-semibold",
    ghost:   "border-transparent bg-transparent hover:bg-warm-100 dark:hover:bg-warm-700 text-warm-600 dark:text-warm-400",
  };
  return (
    <button className={base + (v[variant || "default"]) + " " + (className || "")} onClick={onClick} type="button" disabled={disabled}>
      {children}
    </button>
  );
}

export function Fld({ id, as, type, value, onChange, placeholder, rows, onKeyDown, min, max, style, className, children }) {
  var base = "w-full px-3 py-2 rounded-xl border border-warm-300 dark:border-warm-600 bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 text-sm focus:outline-none focus:ring-2 focus:ring-warm-400 dark:focus:ring-warm-500 transition placeholder-warm-400 dark:placeholder-warm-500 ";
  if (as === "select") return <select id={id} className={base + (className || "")} value={value} onChange={onChange} style={style}>{children}</select>;
  if (as === "textarea") return <textarea id={id} className={base + (className || "")} value={value} onChange={onChange} placeholder={placeholder} rows={rows || 2} onKeyDown={onKeyDown}/>;
  return <input id={id} className={base + (className || "")} type={type || "text"} value={value} onChange={onChange} placeholder={placeholder} min={min} max={max} style={style}/>;
}

export function Sec({ label, children }) {
  return (
    <div className="mb-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-warm-500 dark:text-warm-400 mb-2">{label}</div>
      {children}
    </div>
  );
}

export function RowItem({ label, value, bold }) {
  return (
    <div className="flex justify-between items-start text-sm py-2 border-b border-warm-100 dark:border-warm-700 last:border-0">
      <span className="text-warm-500 dark:text-warm-400 shrink-0 mr-3">{label}</span>
      <span className={"text-right " + (bold ? "font-semibold" : "")}>{value}</span>
    </div>
  );
}

export function Metric({ label, value, accent }) {
  return (
    <div className="bg-warm-100 dark:bg-warm-700 rounded-2xl p-4">
      <div className="text-xs text-warm-500 dark:text-warm-400 mb-1">{label}</div>
      <div className={"text-2xl font-semibold " + (accent ? "text-emerald-600 dark:text-emerald-400" : "text-warm-900 dark:text-warm-100")}>{value}</div>
    </div>
  );
}

export function DarkBtn({ dark, onClick }) {
  return (
    <button onClick={onClick} type="button" className="p-2 rounded-xl border border-warm-300 dark:border-warm-600 bg-white dark:bg-warm-800 hover:bg-warm-100 dark:hover:bg-warm-700 text-warm-600 dark:text-warm-300 transition text-base">
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

export function Toggle({ value, onChange }) {
  return (
    <button type="button" onClick={onChange} className={"relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none " + (value ? "bg-warm-500" : "bg-warm-200 dark:bg-warm-700")}>
      <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition-transform " + (value ? "translate-x-6" : "translate-x-1")}/>
    </button>
  );
}

export function StatusBtns({ current, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS.map(s => {
        var st = SS[s], sel = current === s;
        return (
          <button key={s} type="button" onClick={() => onChange(s)} className={"px-4 py-1.5 rounded-xl text-sm border-2 font-medium transition-all focus:outline-none active:scale-95 " + st.border + " " + st.text + " " + (sel ? st.sel + " font-bold" : "bg-transparent")}>
            {s}
          </button>
        );
      })}
    </div>
  );
}
