import { useState } from 'react';
import { uid } from '../utils';
import { Btn } from './ui';

export function TodoList({ todos, onChange }) {
  var [inp, setInp] = useState("");
  var [showDone, setShowDone] = useState(true);
  var [dragging, setDragging] = useState(null);
  var [dragOver, setDragOver] = useState(null);

  var visible = showDone ? todos : todos.filter(t => !t.done);
  var doneCount = todos.filter(t => t.done).length;

  function add() {
    if (!inp.trim()) return;
    onChange(todos.concat([{ id: uid(), text: inp.trim(), done: false }]));
    setInp("");
  }
  function tog(id) { onChange(todos.map(t => t.id === id ? { ...t, done: !t.done } : t)); }
  function del(id) { onChange(todos.filter(t => t.id !== id)); }

  function onDragStart(e, id) { setDragging(id); e.dataTransfer.effectAllowed = "move"; }
  function onDragOver(e, id) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; setDragOver(id); }
  function onDrop(e, targetId) {
    e.preventDefault();
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return; }
    var from = todos.findIndex(t => t.id === dragging);
    var to = todos.findIndex(t => t.id === targetId);
    if (from < 0 || to < 0) { setDragging(null); setDragOver(null); return; }
    var next = todos.slice();
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
    setDragging(null); setDragOver(null);
  }
  function onDragEnd() { setDragging(null); setDragOver(null); }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input id="todo-inp" value={inp} onChange={e => setInp(e.target.value)} placeholder="Add a next step…" onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }} className="flex-1 px-3 py-2 rounded-xl border border-warm-300 dark:border-warm-600 bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 text-sm focus:outline-none focus:ring-2 focus:ring-warm-400 dark:focus:ring-warm-500 transition placeholder-warm-400 dark:placeholder-warm-500"/>
        <Btn onClick={add} className="shrink-0">Add</Btn>
      </div>
      {doneCount > 0 && (
        <button type="button" onClick={() => setShowDone(s => !s)} className="text-xs text-warm-400 dark:text-warm-500 hover:text-warm-600 dark:hover:text-warm-300 transition mb-2">
          {showDone ? "Hide" : "Show"} {doneCount} completed step{doneCount !== 1 ? "s" : ""}
        </button>
      )}
      {todos.length === 0 && <p className="text-sm text-warm-300 dark:text-warm-600">No steps yet.</p>}
      {visible.map(t => (
        <div key={t.id} draggable={true} onDragStart={e => onDragStart(e, t.id)} onDragOver={e => onDragOver(e, t.id)} onDrop={e => onDrop(e, t.id)} onDragEnd={onDragEnd} className={"flex items-start gap-2 py-2 border-b border-warm-100 dark:border-warm-700 last:border-0 group transition-all " + (dragging === t.id ? "opacity-40" : "") + (dragOver === t.id && dragging !== t.id ? " bg-warm-50 dark:bg-warm-700/50 rounded-lg" : "")}>
          <span className="mt-1 shrink-0 cursor-grab active:cursor-grabbing text-warm-300 dark:text-warm-600 hover:text-warm-400 select-none">⠿</span>
          <button type="button" onClick={() => tog(t.id)} className={"mt-0.5 shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all " + (t.done ? "border-emerald-400 bg-emerald-400 dark:border-emerald-500 dark:bg-emerald-500" : "border-warm-300 dark:border-warm-600 hover:border-warm-400")}>
            {t.done && <span className="text-white text-xs leading-none">✓</span>}
          </button>
          <span className={"text-sm flex-1 leading-relaxed " + (t.done ? "line-through text-warm-300 dark:text-warm-600" : "text-warm-800 dark:text-warm-200")}>{t.text}</span>
          <button type="button" onClick={() => del(t.id)} className="opacity-0 group-hover:opacity-100 text-warm-300 dark:text-warm-600 hover:text-red-500 dark:hover:text-red-400 transition text-base leading-none px-1 shrink-0">×</button>
        </div>
      ))}
    </div>
  );
}
