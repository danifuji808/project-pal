import { useState } from 'react';
import { useSwipeBack } from '../hooks/useSwipeBack';
import { THEMES, CRAFT, STATUS, SS } from '../constants';
import { Card, Btn, Sec, Fld, Toggle } from './ui';

export function SettingsPage({ settings, onChange, onBack }) {
  useSwipeBack(onBack);
  var [s, setS] = useState(settings);
  var [saved, setSaved] = useState(false);

  function upd(k, v) {
    var next = { ...s, [k]: v };
    setS(next);
  }

  function handleSave() {
    onChange(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pb-8">
      <div className="sticky top-0 z-50 bg-warm-50 dark:bg-warm-900 -mx-4 px-4 pb-4 border-b border-warm-100 dark:border-warm-800">
        <div className="flex items-center gap-3 pt-4">
          <Btn onClick={onBack}>← Back</Btn>
          <h2 className="text-2xl font-bold text-warm-800 dark:text-warm-100 flex-1">⚙️ Settings</h2>
          {saved && <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-white dark:bg-warm-800 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800">Saved!</span>}
          <Btn variant="primary" onClick={handleSave}>Save</Btn>
        </div>
      </div>
    
    <div className="mt-4">

      <Card className="mb-4">
        <h3 className="font-semibold text-warm-800 dark:text-warm-100 mb-4">🎨 Appearance</h3>
        <Sec label="Theme">
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(THEMES).map(k => {
              var t = THEMES[k], locked = !t.free && !s.isDonor, sel = s.theme === k;
              return (
                <button key={k} type="button" onClick={() => { if (!locked) upd("theme", k); }} className={"relative py-3 px-2 rounded-xl border-2 text-xs font-medium transition-all text-center " + (locked ? "opacity-40 cursor-not-allowed border-warm-200 dark:border-warm-700" : "cursor-pointer ") + (sel && !locked ? "border-warm-500 bg-warm-100 dark:bg-warm-700" : "border-warm-200 dark:border-warm-700 hover:bg-warm-50 dark:hover:bg-warm-800")}>
                  <div className="text-lg mb-1">{t.emoji}</div>
                  <div>{t.label}</div>
                  {locked && <div className="text-warm-300 dark:text-warm-600" style={{ fontSize: 9 }}>donor unlock</div>}
                </button>
              );
            })}
          </div>
        </Sec>
        <Sec label="Icon Set">
          <div className="flex flex-col gap-2">
            {[["default","🧶 Default","Current emoji set"],["minimal","✦ Minimal","Simple symbols"],["none","Aa None","Text only"]].map(x => (
              <button key={x[0]} type="button" onClick={() => upd("iconSet", x[0])} className={"w-full flex items-center gap-3 py-2.5 px-3 rounded-xl border-2 text-sm transition-all " + (s.iconSet === x[0] ? "border-warm-500 bg-warm-100 dark:bg-warm-700 font-bold" : "border-warm-200 dark:border-warm-700 hover:bg-warm-50 dark:hover:bg-warm-800")}>
                <span className="w-8 text-center">{x[1].split(" ")[0]}</span>
                <span>{x[1].split(" ").slice(1).join(" ")}</span>
                <span className="text-xs text-warm-400 dark:text-warm-500 ml-auto">{x[2]}</span>
              </button>
            ))}
          </div>
        </Sec>
        <Sec label="Card Layout">
          <div className="flex flex-col gap-2">
            {[
              ["default","Default","Timer → Info → Stats → To-do → Notes → History"],
              ["working","Working","Timer → To-do → Notes → Info → Stats → History"],
              ["overview","Overview","Info → Stats → Timer → To-do → Notes → History"]
            ].map(x => (
              <button key={x[0]} type="button" onClick={() => upd("cardLayout", x[0])} className={"w-full flex flex-col py-2.5 px-3 rounded-xl border-2 text-sm transition-all text-left " + (s.cardLayout === x[0] ? "border-warm-500 bg-warm-100 dark:bg-warm-700 font-bold" : "border-warm-200 dark:border-warm-700 hover:bg-warm-50 dark:hover:bg-warm-800")}>
                <span className="font-medium">{x[1]}</span>
                <span className="text-xs text-warm-400 dark:text-warm-500 mt-0.5">{x[2]}</span>
              </button>
            ))}
          </div>
        </Sec>
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold text-warm-800 dark:text-warm-100 mb-4">🪡 Defaults</h3>
        <Sec label="Default craft">
          <div className="flex flex-wrap gap-2">
            {CRAFT.map(c => (
              <button key={c} type="button" onClick={() => upd("defaultCraft", c)} className={"px-4 py-1.5 rounded-xl text-sm border-2 font-medium transition-all " + (s.defaultCraft === c ? "border-warm-500 bg-warm-100 dark:bg-warm-700 font-bold" : "border-warm-200 dark:border-warm-700 hover:bg-warm-50")}>
                {c}
              </button>
            ))}
          </div>
        </Sec>
        <Sec label="Default status">
          <div className="flex flex-wrap gap-2">
            {STATUS.map(st => {
              var ss = SS[st];
              return (
                <button key={st} type="button" onClick={() => upd("defaultStatus", st)} className={"px-4 py-1.5 rounded-xl text-sm border-2 font-medium transition-all " + ss.border + " " + ss.text + " " + (s.defaultStatus === st ? ss.sel + " font-bold" : "bg-transparent")}>
                  {st}
                </button>
              );
            })}
          </div>
        </Sec>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium text-warm-800 dark:text-warm-200">Auto-WIP on session start</div>
            <div className="text-xs text-warm-400 dark:text-warm-500">Automatically mark Queued projects as WIP when a session begins</div>
          </div>
          <Toggle value={s.autoWip} onChange={() => upd("autoWip", !s.autoWip)}/>
        </div>
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold text-warm-800 dark:text-warm-100 mb-4">🔢 Row Counter</h3>
        <Sec label="Controls active when">
          <div className="flex flex-col gap-2">
            {[
              ["always","Always","Controls always active"],
              ["session","During session only","Controls active only while timer is running"],
              ["visible","Always visible, always active","Counter shown and active at all times"],
              ["hidden","Hidden","I don't need a row counter"]
            ].map(x => (
              <button key={x[0]} type="button" onClick={() => upd("rowCounterVisibility", x[0])} className={"w-full flex flex-col py-2.5 px-3 rounded-xl border-2 text-sm transition-all text-left " + (s.rowCounterVisibility === x[0] ? "border-warm-500 bg-warm-100 dark:bg-warm-700 font-bold" : "border-warm-200 dark:border-warm-700 hover:bg-warm-50 dark:hover:bg-warm-800")}>
                <span className="font-medium">{x[1]}</span>
                <span className="text-xs text-warm-400 dark:text-warm-500 mt-0.5">{x[2]}</span>
              </button>
            ))}
          </div>
        </Sec>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium text-warm-800 dark:text-warm-200">Mini celebration on completion</div>
            <div className="text-xs text-warm-400 dark:text-warm-500">Show 🎉 when all repeats are done</div>
          </div>
          <Toggle value={s.celebrationEnabled !== false} onChange={() => upd("celebrationEnabled", !s.celebrationEnabled)}/>
        </div>
      </Card>

      <Card className="mb-4">
        <h3 className="font-semibold text-warm-800 dark:text-warm-100 mb-4">🍅 Break Reminders</h3>
        <div className="flex items-center justify-between py-2">
          <div>
            <div className="text-sm font-medium text-warm-800 dark:text-warm-200">Enable break reminders</div>
            <div className="text-xs text-warm-400 dark:text-warm-500">Pause and prompt for a stretch break at regular intervals</div>
          </div>
          <Toggle value={s.breakReminders} onChange={() => upd("breakReminders", !s.breakReminders)}/>
        </div>
        {s.breakReminders && (
          <div className="mt-3 pt-3 border-t border-warm-100 dark:border-warm-700">
            <div className="text-xs text-warm-500 dark:text-warm-400 mb-2">Break interval (minutes)</div>
            <div className="flex items-center gap-3">
              <Fld id="break-interval" type="number" min="10" max="120" value={s.breakInterval} onChange={e => upd("breakInterval", parseInt(e.target.value) || 50)} className="w-24"/>
              <span className="text-sm text-warm-400">minutes</span>
            </div>
            <p className="text-xs text-warm-300 dark:text-warm-600 mt-2 italic">Full break reminder functionality coming soon!</p>
          </div>
        )}
      </Card>

      <Card>
        <h3 className="font-semibold text-warm-800 dark:text-warm-100 mb-4">❤️ Support Project Pal</h3>
        <p className="text-sm text-warm-500 dark:text-warm-400 mb-4">Project Pal is free and always will be. If it's brought value to your crafting life, consider buying me a coffee!</p>
        <div className="flex items-center justify-between py-2 border-b border-warm-100 dark:border-warm-700">
          <div className="text-sm text-warm-800 dark:text-warm-200">Donor status</div>
          <span className={s.isDonor ? "text-sm text-emerald-600 dark:text-emerald-400 font-semibold" : "text-sm text-warm-400"}>
            {s.isDonor ? "❤️ Thank you!" : "Not yet"}
          </span>
        </div>
        <a href="https://ko-fi.com" target="_blank" rel="noreferrer" className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-warm-600 text-white hover:bg-warm-700 transition border border-warm-600">
          ☕ Support on Ko-fi
        </a>
        <p className="text-xs text-warm-300 dark:text-warm-600 text-center mt-3">Any donation unlocks all current and future themes permanently.</p>
      </Card>

    </div>
  </div>
  );
}