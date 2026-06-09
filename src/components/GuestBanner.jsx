import { useState } from 'react';

export function GuestBanner({ onExit }) {
  var [modal, setModal] = useState(false);
  return (
    <div>
      <div className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 px-4 py-2 flex items-center justify-between gap-3">
        <p className="text-xs text-amber-700 dark:text-amber-300">👀 Guest mode — data won't be saved.</p>
        <div className="flex items-center gap-3 shrink-0">
          <button type="button" onClick={() => setModal(true)} className="text-xs font-semibold text-amber-700 dark:text-amber-300 underline hover:no-underline">Create account</button>
          <button type="button" onClick={onExit} className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-800">Sign in</button>
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-warm-800 rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <div className="text-2xl mb-2">🧶</div>
            <h2 className="text-lg font-bold text-warm-900 dark:text-warm-100 mb-2">Ready to save your projects?</h2>
            <p className="text-sm text-warm-500 dark:text-warm-400 mb-5">Create a free account to save your projects, sync across devices, and track your progress over time.</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setModal(false); onExit(); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-warm-600 text-white hover:bg-warm-700 transition border border-warm-600">Create account</button>
              <button type="button" onClick={() => setModal(false)} className="px-4 py-2.5 rounded-xl text-sm border border-warm-300 dark:border-warm-600 text-warm-600 dark:text-warm-400 hover:bg-warm-100 dark:hover:bg-warm-700 transition">Keep browsing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
