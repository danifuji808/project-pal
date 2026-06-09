import { DEFAULT_SETTINGS } from './constants';

export function uid() { return Date.now() * 1000 + Math.floor(Math.random() * 1000); }

export function makeYarn(unit) {
  return { id: uid(), brand:"", name:"", colorway:"", dyeLot:"", amountPerSkein:"", unit: unit || "yards", numSkeins:"" };
}

export function makeProject(s) {
  var st = s || DEFAULT_SETTINGS;
  return {
    id: uid(), name:"", pattern:"", patternUrl:"", size:"",
    craft: st.defaultCraft || "Knit", type:"Beanie/Hat",
    status: st.defaultStatus || "Queued", recipient:"",
    needleSizes:[""], yarns:[makeYarn(st.defaultUnit)],
    notes:[], todos:[], sessions:[], activeSession:null,
    rowCounter:{ current:1, start:1 },
    repeatCounter:{ enabled:false, from:1, to:1, total:1, current:0 },
    priorHours:"", priorMins:"", _nameEdited:false
  };
}

export function uniq(name, list, xid) {
  var ex = list.filter(p => p.id !== xid).map(p => p.name);
  if (!ex.includes(name)) return name;
  var i = 2;
  while (ex.includes(name + " " + i)) i++;
  return name + " " + i;
}

export function ms2str(ms) {
  var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sc = s % 60;
  if (h > 0) return h + "h " + m + "m";
  if (m > 0) return m + "m " + sc + "s";
  return sc + "s";
}

export function ms2clock(ms) {
  var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sc = s % 60;
  return String(h).padStart(2,"0") + ":" + String(m).padStart(2,"0") + ":" + String(sc).padStart(2,"0");
}

export function fmtDate(iso) {
  return new Date(iso).toLocaleString([], { month:"short", day:"numeric", year:"numeric", hour:"2-digit", minute:"2-digit" });
}

export function relDate(iso) {
  var d = Date.now() - new Date(iso), mi = Math.floor(d / 60000), hr = Math.floor(mi / 60), dy = Math.floor(hr / 24), wk = Math.floor(dy / 7);
  if (mi < 1) return "just now";
  if (mi < 60) return mi + "m ago";
  if (hr < 24) return hr + "h ago";
  if (dy === 1) return "yesterday";
  if (dy < 7) return dy + " days ago";
  if (wk === 1) return "1 week ago";
  return wk + " weeks ago";
}

export function offMs(h, m) { return ((parseInt(h) || 0) * 60 + (parseInt(m) || 0)) * 60000; }

export function totalTime(p) {
  var d = p.sessions.reduce((a, s) => a + s.duration, 0);
  return p.activeSession ? d + (Date.now() - new Date(p.activeSession.start)) : d;
}

export function dkey(iso) {
  var d = new Date(iso);
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0");
}

export function heat(mins, dark) {
  if (mins <= 0) return dark ? "#3a2a1a" : "#f0e8dc";
  if (mins < 30) return "#d4edda";
  if (mins < 60) return "#8fce9f";
  if (mins < 120) return "#4caf6e";
  return "#1e7e3e";
}

export function buildDayMap(projects) {
  var m = {};
  projects.forEach(p => p.sessions.forEach(s => {
    if (!s.start) return;
    var k = dkey(s.start);
    m[k] = (m[k] || 0) + s.duration;
  }));
  return m;
}

export function lastSession(p) {
  var r = p.sessions.filter(s => !!s.start);
  if (!r.length) return null;
  return Math.max(...r.map(s => new Date(s.start).getTime()));
}

export function sortProjects(ps) {
  return ps.slice().sort((a, b) => {
    var ac = a.status === "Completed", bc = b.status === "Completed";
    if (ac && !bc) return 1;
    if (!ac && bc) return -1;
    return (lastSession(b) || 0) - (lastSession(a) || 0);
  });
}

export function loadSettings() {
  try { return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(localStorage.getItem("pp_settings") || "{}")); }
  catch { return Object.assign({}, DEFAULT_SETTINGS); }
}

export function saveSettings(s) {
  try { localStorage.setItem("pp_settings", JSON.stringify(s)); } catch {}
}