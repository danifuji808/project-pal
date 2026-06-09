import { useEffect } from 'react';

export function useSwipeBack(onBack) {
  useEffect(() => {
    var sx = null, sy = null;
    function ts(e) {
      var t = e.touches[0];
      if (t.clientX > 40) { sx = null; return; }
      sx = t.clientX; sy = t.clientY;
    }
    function te(e) {
      if (sx === null) return;
      var t = e.changedTouches[0];
      if (t.clientX - sx > 60 && Math.abs(t.clientY - sy) < 80) onBack();
      sx = null; sy = null;
    }
    document.addEventListener("touchstart", ts, { passive: true });
    document.addEventListener("touchend", te, { passive: true });
    return () => {
      document.removeEventListener("touchstart", ts);
      document.removeEventListener("touchend", te);
    };
  }, [onBack]);
}