import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sb, dbLoad, dbUpsert, dbDelete } from './supabaseClient';
import { SAMPLE_PROJECT } from './constants';
import { makeProject, loadSettings, saveSettings, uid } from './utils';
import { Onboarding } from './components/Onboarding';
import { AuthScreen } from './components/AuthScreen';
import { GuestBanner } from './components/GuestBanner';
import { Dashboard } from './components/Dashboard';
import { DetailView } from './components/DetailView';
import { FormView } from './components/FormView';
import { StatsPage } from './components/StatsPage';
import { SettingsPage } from './components/SettingsPage';
import { PlaceholderPage } from './components/PlaceholderPage';
import { AppHeader } from './components/AppHeader';

export default function App() {
  var [user, setUser] = useState(null);
  var [guest, setGuest] = useState(false);
  var [authReady, setReady] = useState(false);
  var [projects, setProj] = useState([]);
  var [loading, setLoad] = useState(false);
  var [activeId, setAid] = useState(null);
  var [settings, setSettings] = useState(loadSettings);
  var [dark, setDark] = useState(() => localStorage.getItem("pp_dark") === "1");
  var [showOnboarding, setShowOnboarding] = useState(false);

  var navigate = useNavigate();
  var location = useLocation();
  var view = location.pathname.replace("/", "") || "dashboard";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("pp_dark", dark ? "1" : "0");
  }, [dark]);

  useEffect(() => {
    sb.auth.getSession().then(r => {
      setUser(r.data.session ? r.data.session.user : null);
      setReady(true);
    });
    var sub = sb.auth.onAuthStateChange((_, s) => setUser(s ? s.user : null));
    return () => sub.data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (guest) {
      setProj([{ ...SAMPLE_PROJECT }]);
      setLoad(false);
      if (!settings.onboardingDone) setShowOnboarding(true);
      return;
    }
    if (!user) { setProj([]); setLoad(false); return; }
    if (!settings.onboardingDone) setShowOnboarding(true);
    setLoad(true);
    dbLoad(user.id).then(d => { setProj(d); setLoad(false); });
  }, [user, guest]);

  function updSettings(next) { setSettings(next); saveSettings(next); }
  var active = projects.find(pr => pr.id === activeId);

  function mut(id, patch) {
    setProj(ps => {
      var next = ps.map(pr => pr.id === id ? { ...pr, ...patch } : pr);
      if (user) { var up = next.find(pr => pr.id === id); if (up) dbUpsert(up, user.id); }
      return next;
    });
  }

  function handleSave(updated) {
    if (activeId) {
      setProj(ps => ps.map(pr => pr.id === activeId ? updated : pr));
      if (user) dbUpsert(updated, user.id);
      navigate("/detail");
    } else {
      setProj(ps => [updated, ...ps]);
      if (user) dbUpsert(updated, user.id);
      navigate("/");
    }
  }

  function handleDelete() {
    if (user) dbDelete(activeId);
    setProj(ps => ps.filter(pr => pr.id !== activeId));
    setAid(null);
    navigate("/");
  }

  function handleStart() {
    var pr = projects.find(x => x.id === activeId);
    var patch = { activeSession: { start: new Date().toISOString() } };
    if (pr && pr.status === "Queued" && settings.autoWip) patch.status = "WIP";
    mut(activeId, patch);
  }

  function handleStop() {
    setProj(ps => ps.map(pr => {
      if (pr.id !== activeId || !pr.activeSession) return pr;
      var end = new Date().toISOString(), dur = new Date(end) - new Date(pr.activeSession.start);
      var s = { id: uid(), start: pr.activeSession.start, end, duration: dur };
      var up = { ...pr, activeSession: null, sessions: pr.sessions.concat([s]) };
      if (user) dbUpsert(up, user.id);
      return up;
    }));
  }

  function handleAddNote(text) {
    if (!active) return;
    mut(activeId, { notes: active.notes.concat([{ id: uid(), text, ts: new Date().toISOString() }]) });
  }

  function handleDeleteNote(nid) {
    if (!active) return;
    mut(activeId, { notes: active.notes.filter(n => n.id !== nid) });
  }

  function handleDeleteSess(sid) {
    if (!active) return;
    mut(activeId, { sessions: active.sessions.filter(s => s.id !== sid) });
  }

  function handleSignOut() { sb.auth.signOut(); setGuest(false); navigate("/"); }
  function handleGuest() { setGuest(true); navigate("/"); }
  function handleExitGuest() { setGuest(false); navigate("/"); }

  function handleOnboardingDone(prefs, newDark) {
    setShowOnboarding(false);
    updSettings({ ...settings, ...prefs });
    if (newDark !== undefined) setDark(newDark);
  }

  function handleNav(v) { navigate("/" + (v === "dashboard" ? "" : v)); }

  function handleOpen(pr) { setAid(pr.id); navigate("/detail"); }
  function handleNew() { setAid(null); navigate("/form"); }
  function handleEdit() { navigate("/form"); }

  if (!authReady && !guest) return <div className="min-h-screen flex items-center justify-center text-warm-400 text-2xl">🧶</div>;
  if (!user && !guest) return <AuthScreen dark={dark} onToggleDark={() => setDark(d => !d)} onGuest={handleGuest}/>;
  if (showOnboarding) return <Onboarding onDone={handleOnboardingDone}/>;

  var banner = guest ? <GuestBanner onExit={handleExitGuest}/> : null;
  
  var header = (user || guest) ? (
  <AppHeader
    dark={dark}
    onToggleDark={() => setDark(d => !d)}
    onNav={handleNav}
    onSignOut={handleSignOut}
  />
) : null;

  function wrap(content) {
    return (
      <div>
        {header}
        {banner}
        {content}
      </div>
    );
  }

  if (view === "stats") return wrap(<StatsPage projects={projects} dark={dark} onBack={() => navigate(-1)}/>);
  if (view === "settings") return wrap(<SettingsPage settings={settings} onChange={updSettings} onBack={() => navigate(-1)}/>);
  if (view === "resources") return wrap(<PlaceholderPage title="📚 Resources" emoji="📚" description="Knit & crochet abbreviations, US vs UK terms, needle/hook conversion charts, and more — coming soon!" onBack={() => navigate(-1)}/>);
  if (view === "tools") return wrap(<PlaceholderPage title="🪡 Tools" emoji="🪡" description="Needle & hook inventory, gauge calculator, recipient measurements, and more — coming soon!" onBack={() => navigate(-1)}/>);
  if (view === "form") return wrap(<FormView initial={activeId ? { ...active } : makeProject(settings)} projects={projects} isEdit={!!activeId} settings={settings} onSave={handleSave} onCancel={() => navigate(-1)}/>);
  if (view === "detail" && active) return wrap(<DetailView project={active} dark={dark} settings={settings} onBack={() => navigate(-1)} onEdit={handleEdit} onDelete={handleDelete} onStart={handleStart} onStop={handleStop} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} onStatusChange={s => mut(activeId, { status: s })} onDeleteSession={handleDeleteSess} onTodosChange={todos => mut(activeId, { todos })} onRowCounterChange={rc => mut(activeId, { rowCounter: rc })} onRepeatCounterChange={rep => mut(activeId, { repeatCounter: rep })}/>);
  return wrap(<Dashboard projects={projects} loading={loading} dark={dark} onToggleDark={() => setDark(d => !d)} onNew={handleNew} onOpen={handleOpen} onNav={handleNav} onSignOut={handleSignOut}/>);
}