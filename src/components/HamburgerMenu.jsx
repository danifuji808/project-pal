import { useState } from 'react';

function MenuItem({ icon, label, onClick, placeholder }) {
  return (
    <button type="button" onClick={onClick} className={"w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-warm-50 dark:hover:bg-warm-700 transition text-left " + (placeholder ? "italic text-warm-300 dark:text-warm-600" : "text-warm-800 dark:text-warm-200")}>
      <span>{icon}</span>
      <span>{label}</span>
      {placeholder && <span className="text-xs ml-auto">soon</span>}
    </button>
  );
}

export function HamburgerMenu({ onNav, onSignOut }) {
  var [open, setOpen] = useState(false);
  function go(v) { setOpen(false); onNav(v); }
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} className="p-2 text-warm-600 dark:text-warm-300 hover:text-warm-800 dark:hover:text-warm-100 transition text-base focus:outline-none">☰</button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}/>
          <div className="absolute right-0 top-10 z-50 bg-white dark:bg-warm-800 rounded-2xl shadow-xl border border-warm-200 dark:border-warm-700 py-2 min-w-48">
            <MenuItem icon="📊" label="Stats" onClick={() => go("stats")}/>
            <MenuItem icon="📚" label="Resources" onClick={() => go("resources")} placeholder/>
            <MenuItem icon="🪡" label="Tools" onClick={() => go("tools")} placeholder/>
            <div className="border-t border-warm-100 dark:border-warm-700 my-1"/>
            <MenuItem icon="⚙️" label="Settings" onClick={() => go("settings")}/>
            <div className="border-t border-warm-100 dark:border-warm-700 my-1"/>
            <MenuItem icon="🚪" label="Sign out" onClick={() => { setOpen(false); onSignOut(); }}/>
          </div>
        </>
      )}
    </div>
  );
}
