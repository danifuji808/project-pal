import { useNavigate } from 'react-router-dom';
import { DarkBtn } from './ui';
import { HamburgerMenu } from './HamburgerMenu';

export function AppHeader({ dark, onToggleDark, onNav, onSignOut }) {
  var navigate = useNavigate();
  return (
    <div className="sticky top-0 z-50 bg-warm-50 dark:bg-warm-900 border-b border-warm-100 dark:border-warm-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <button type="button" onClick={() => navigate("/")} className="text-left focus:outline-none">
          <span className="text-lg font-bold text-warm-800 dark:text-warm-100">🧶 Project Pal</span>
        </button>
        <div className="flex items-center gap-2">
          <DarkBtn dark={dark} onClick={onToggleDark}/>
          <HamburgerMenu onNav={onNav} onSignOut={onSignOut}/>
        </div>
      </div>
    </div>
  );
}