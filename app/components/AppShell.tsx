"use client";

import { useEffect, useMemo, useState } from "react";

type StatKey = "str" | "int" | "ego" | "aura";
type Screen =
  | "status"
  | "gym"
  | "side"
  | "hygiene"
  | "penalty"
  | "weekly"
  | "taskboard"
  | "rewards"
  | "achievements"
  | "mealprep"
  | "expenses"
  | "leaderboard"
  | "business"
  | "inbox"
  | "architect";

type Quest = {
  id: string;
  title: string;
  xp: number;
  stat?: StatKey;
};

type PlayerState = {
  playerCreated: boolean;
  username: string;
  level: number;
  xp: number;
  dailyXp: number;
  coupons: number;
  stats: Record<StatKey, number>;
  completed: Record<string, string>;
  penalties: Record<string, number>;
  customTasks: Quest[];
  meals: string[];
  expenses: string[];
  achievements: string[];
  lastResetDate: string;
};

const STORAGE_KEY = "beyond-leveling-clean-state-v1";
const DAILY_GOAL = 1500;

const gymPart1: Quest[] = [
  { id: "gym-pushups", title: "50 Push-ups", xp: 120, stat: "str" },
  { id: "gym-situps", title: "50 Sit-ups", xp: 120, stat: "str" },
  { id: "gym-squats", title: "50 Squats", xp: 120, stat: "str" },
  { id: "gym-steps", title: "10,000 Steps / Run", xp: 240, stat: "aura" },
];

const gymPart2: Quest[] = [
  { id: "gym-extra-1", title: "Workout Part II - Main Lift", xp: 180, stat: "str" },
  { id: "gym-extra-2", title: "Workout Part II - Accessory", xp: 150, stat: "str" },
  { id: "gym-extra-3", title: "Stretch / Recovery", xp: 80, stat: "aura" },
];

const sideQuests: Quest[] = [
  { id: "side-content", title: "Create content / edit video", xp: 200, stat: "int" },
  { id: "side-build", title: "Build the app / business", xp: 220, stat: "int" },
  { id: "side-learn", title: "Learn skill 60 min", xp: 160, stat: "int" },
  { id: "side-outreach", title: "Promote / outreach", xp: 140, stat: "ego" },
  { id: "side-job", title: "Daily Job 9-5", xp: 350, stat: "ego" },
];

const hygieneQuests: Quest[] = [
  { id: "hy-shower", title: "Shower / hygiene", xp: 50, stat: "aura" },
  { id: "hy-room", title: "Clean room", xp: 50, stat: "aura" },
  { id: "hy-laundry", title: "Laundry", xp: 50, stat: "aura" },
  { id: "hy-dishes", title: "Dishes / kitchen", xp: 50, stat: "aura" },
  { id: "hy-plan", title: "Plan tomorrow", xp: 50, stat: "int" },
];

const taskBoardBase: Quest[] = [
  { id: "task-water", title: "Drink enough water", xp: 50, stat: "aura" },
  { id: "task-post", title: "Post one short video", xp: 100, stat: "ego" },
];

const penalties = [
  { id: "scroll", title: "Doom scrolling" },
  { id: "junk", title: "Junk food" },
  { id: "skip", title: "Skipped planned work" },
  { id: "late", title: "Slept too late" },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function xpForLevel(level: number) {
  return 700 + (level - 1) * 300;
}

function getRank(level: number) {
  if (level >= 50) return "S";
  if (level >= 40) return "A";
  if (level >= 30) return "B";
  if (level >= 20) return "C";
  if (level >= 10) return "D";
  return "E";
}

function getTitle(level: number) {
  if (level >= 50) return "Architect of Destiny";
  if (level >= 40) return "Fatebreaker";
  if (level >= 30) return "The One Who Left It All Behind";
  if (level >= 20) return "Sleepless Visionary";
  if (level >= 10) return "Brokie";
  return "Brokie";
}

function defaultState(): PlayerState {
  return {
    playerCreated: false,
    username: "Player",
    level: 1,
    xp: 0,
    dailyXp: 0,
    coupons: 0,
    stats: { str: 1, int: 1, ego: 0, aura: 0 },
    completed: {},
    penalties: {},
    customTasks: [{ id: "custom-1", title: "Custom objective", xp: 50, stat: "int" }],
    meals: [],
    expenses: [],
    achievements: [],
    lastResetDate: todayKey(),
  };
}

function loadState(): PlayerState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<PlayerState>;
    return { ...defaultState(), ...parsed, stats: { ...defaultState().stats, ...(parsed.stats || {}) } };
  } catch {
    return defaultState();
  }
}

export default function AppShell() {
  const [state, setState] = useState<PlayerState>(() => defaultState());
  const [screen, setScreen] = useState<Screen>("status");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newEntry, setNewEntry] = useState("");

  useEffect(() => {
    const loadedState = loadState();
    const today = todayKey();
    if (loadedState.lastResetDate !== today) {
      loadedState.dailyXp = 0;
      loadedState.completed = {};
      loadedState.penalties = {};
      loadedState.lastResetDate = today;
    }
    setState(loadedState);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, loaded]);

  useEffect(() => {
    // Hard cleanup for every old HUD/layer system. This is the important part.
    const cleanup = () => {
      const selectors = [
        "#beyond-static-hud-v1",
        "#beyond-system-frame-v78",
        "#beyond-asset-gate-v80",
        "#beyond-asset-gate-v93",
        "#beyond-asset-gate-v94",
        "#beyond-asset-gate-v95",
        "#beyond-asset-gate-v96",
        ".static-hud-layer",
        ".static-hud-top",
        ".static-hud-bottom",
        ".outer-top",
        ".outer-bottom",
        ".top-cut",
        ".bottom-cut",
        ".hud-top",
        ".hud-bottom",
        ".hud-top-layer",
        ".hud-bottom-layer",
        ".custom-hud-top-ornament",
        ".custom-hud-bottom-ornament",
        ".statusHudTopV37",
        ".statusHudBottomV37",
        ".statusHudTopSoftV37",
        ".statusHudBottomSoftV37",
        ".statusHudRailV77",
        ".systemHudTopV77",
        ".systemHudBottomV77",
      ];
      document.querySelectorAll(selectors.join(",")).forEach((el) => el.remove());
      document.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        const cls = img.getAttribute("class") || "";
        if (src.includes("/hud/") || cls.includes("hud") || cls.includes("layer")) img.remove();
      });
      document.body.classList.remove("beyond-gate-opening", "beyond-gate-hide-content", "beyond-gate-screen-opening");
    };
    cleanup();
    const id = window.setInterval(cleanup, 1000);
    return () => window.clearInterval(id);
  }, []);

  const xpNeeded = xpForLevel(state.level);
  const xpPercent = Math.max(0, Math.min(100, (state.xp / xpNeeded) * 100));
  const dailyPercent = Math.max(0, Math.min(100, (state.dailyXp / DAILY_GOAL) * 100));

  const allTasks = useMemo(() => [...taskBoardBase, ...state.customTasks], [state.customTasks]);

  function acceptPlayer(name: string) {
    setState((s) => ({ ...s, playerCreated: true, username: name.trim() || "Player" }));
  }

  function completeQuest(q: Quest) {
    const today = todayKey();
    setState((s) => {
      if (s.completed[q.id] === today) return s;
      let nextLevel = s.level;
      let nextXp = s.xp + q.xp;
      let coupons = s.coupons;
      while (nextXp >= xpForLevel(nextLevel)) {
        nextXp -= xpForLevel(nextLevel);
        nextLevel += 1;
        coupons += 5;
      }
      const nextStats = { ...s.stats };
      if (q.stat) nextStats[q.stat] += 1;
      return {
        ...s,
        level: nextLevel,
        xp: nextXp,
        dailyXp: s.dailyXp + q.xp,
        coupons,
        stats: nextStats,
        completed: { ...s.completed, [q.id]: today },
      };
    });
  }

  function addPenalty(id: string) {
    setState((s) => ({
      ...s,
      dailyXp: Math.max(0, s.dailyXp - 50),
      xp: Math.max(0, s.xp - 50),
      penalties: { ...s.penalties, [id]: (s.penalties[id] || 0) + 1 },
      stats: {
        str: Math.max(0, s.stats.str - 1),
        int: Math.max(0, s.stats.int - 1),
        ego: Math.max(0, s.stats.ego - 1),
        aura: Math.max(0, s.stats.aura - 1),
      },
    }));
  }

  function resetLocal() {
    if (!confirm("Reset local Beyond Leveling state?")) return;
    const fresh = defaultState();
    fresh.playerCreated = true;
    setState(fresh);
  }

  if (!loaded) return <div className="bl-loading">Loading system...</div>;

  if (!state.playerCreated) return <IntroScreen onAccept={acceptPlayer} />;

  return (
    <div className="bl-shell">
      <div className="bl-phone">
        <button className="hamburger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
          <span /><span /><span />
        </button>
        {menuOpen && <Menu current={screen} setScreen={(s) => { setScreen(s); setMenuOpen(false); }} />}
        {screen === "status" && <StatusScreen state={state} xpNeeded={xpNeeded} xpPercent={xpPercent} dailyPercent={dailyPercent} resetLocal={resetLocal} />}
        {screen === "gym" && <QuestScreen title="DAILY QUEST" subtitle="[GYM PART I]" quests={gymPart1} completed={state.completed} onComplete={completeQuest} extra={<QuestBlock title="GYM PART II" quests={gymPart2} completed={state.completed} onComplete={completeQuest} />} />}
        {screen === "side" && <QuestScreen title="DAILY QUEST" subtitle="[SIDE HUSTLE]" quests={sideQuests} completed={state.completed} onComplete={completeQuest} />}
        {screen === "hygiene" && <QuestScreen title="DAILY QUEST" subtitle="[HYGIENE & CHORES]" quests={hygieneQuests} completed={state.completed} onComplete={completeQuest} />}
        {screen === "penalty" && <PenaltyScreen state={state} onPenalty={addPenalty} />}
        {screen === "weekly" && <SimpleScreen title="WEEKLY STATS" subtitle="[7 DAY LOG]"><StatCards items={[`Daily XP: ${state.dailyXp}/${DAILY_GOAL}`, `Level: ${state.level}`, `Coupons: ${state.coupons}`, `Completed today: ${Object.values(state.completed).filter((v) => v === todayKey()).length}`]} /></SimpleScreen>}
        {screen === "taskboard" && <TaskBoardScreen tasks={allTasks} completed={state.completed} onComplete={completeQuest} newTask={newTask} setNewTask={setNewTask} addTask={() => { if (!newTask.trim()) return; setState((s) => ({ ...s, customTasks: [...s.customTasks, { id: `custom-${Date.now()}`, title: newTask.trim(), xp: 50, stat: "int" }] })); setNewTask(""); }} />}
        {screen === "rewards" && <SimpleScreen title="REWARD INVENTORY" subtitle="[LEVEL REWARD STORAGE]"><div className="bigNumber">{state.coupons}</div><p className="muted">Coupons earned from level ups.</p></SimpleScreen>}
        {screen === "achievements" && <ListEditor title="ACHIEVEMENTS" subtitle="[MONTHLY GOALS]" placeholder="Add achievement / goal" items={state.achievements} value={newEntry} setValue={setNewEntry} add={() => { if (!newEntry.trim()) return; setState((s) => ({ ...s, achievements: [...s.achievements, newEntry.trim()] })); setNewEntry(""); }} />}
        {screen === "mealprep" && <ListEditor title="MEAL PREP" subtitle="[MEALS / MACROS]" placeholder="Add meal" items={state.meals} value={newEntry} setValue={setNewEntry} add={() => { if (!newEntry.trim()) return; setState((s) => ({ ...s, meals: [...s.meals, newEntry.trim()] })); setNewEntry(""); }} />}
        {screen === "expenses" && <ListEditor title="EXPENSES" subtitle="[MONEY LOG]" placeholder="Add expense" items={state.expenses} value={newEntry} setValue={setNewEntry} add={() => { if (!newEntry.trim()) return; setState((s) => ({ ...s, expenses: [...s.expenses, newEntry.trim()] })); setNewEntry(""); }} />}
        {screen === "leaderboard" && <SimpleScreen title="LEADERBOARD" subtitle="[PLAYERS]" ><div className="leaderRow"><b>#1 {state.username}</b><span>LVL {state.level}</span></div></SimpleScreen>}
        {screen === "business" && <SimpleScreen title="BUSINESS" subtitle="[BEYOND INDUSTRIES]" ><p className="notice">Business screen placeholder. Safe clean version, no old HUD layers.</p></SimpleScreen>}
        {screen === "inbox" && <SimpleScreen title="SYSTEM INBOX" subtitle="[MESSAGES]" ><p className="notice">No new system messages.</p></SimpleScreen>}
        {screen === "architect" && <SimpleScreen title="ARCHITECT CONSOLE" subtitle="[DEBUG]" ><button className="primary" onClick={() => setState((s) => ({ ...s, level: s.level + 1, coupons: s.coupons + 5 }))}>+ Level</button></SimpleScreen>}
      </div>
    </div>
  );
}

function IntroScreen({ onAccept }: { onAccept: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <div className="bl-shell">
      <div className="introCard">
        <div className="alertCircle">!</div>
        <h1>You have acquired the qualifications to become a player.</h1>
        <p>Will you accept?</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" />
        <button className="primary" onClick={() => onAccept(name)}>YES</button>
        <button className="ghost">NO</button>
      </div>
    </div>
  );
}

function Menu({ current, setScreen }: { current: Screen; setScreen: (s: Screen) => void }) {
  const items: { key: Screen; label: string }[] = [
    { key: "status", label: "Status" }, { key: "gym", label: "Gym" }, { key: "side", label: "Side Hustle" },
    { key: "hygiene", label: "Hygiene" }, { key: "penalty", label: "Penalty Zone" }, { key: "weekly", label: "Weekly Stats" },
    { key: "taskboard", label: "Task Board" }, { key: "rewards", label: "Rewards" }, { key: "achievements", label: "Achievements" },
    { key: "mealprep", label: "Meal Prep" }, { key: "expenses", label: "Expenses" }, { key: "leaderboard", label: "Leaderboard" },
    { key: "business", label: "Business" }, { key: "inbox", label: "System Inbox" }, { key: "architect", label: "Architect" },
  ];
  return <div className="menuPanel">{items.map((i) => <button key={i.key} className={current === i.key ? "active" : ""} onClick={() => setScreen(i.key)}>{i.label}</button>)}</div>;
}

function ScreenFrame({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return <main className="screenFrame"><header><div className="titleRow"><span className="line" /><h1>{title}</h1><span className="line" /></div>{subtitle && <div className="subtitle">{subtitle}</div>}</header>{children}</main>;
}

function StatusScreen({ state, xpNeeded, xpPercent, dailyPercent, resetLocal }: { state: PlayerState; xpNeeded: number; xpPercent: number; dailyPercent: number; resetLocal: () => void }) {
  return <ScreenFrame title="STATUS">
    <section className="panel levelPanel"><h2>LEVEL {state.level}</h2><p><b>RANK:</b> {getRank(state.level)} RANK</p><p><b>TITLE:</b> {getTitle(state.level)}</p></section>
    <section className="panel compact"><div className="smallTitle">DAILY XP</div><div className="progress"><span style={{ width: `${dailyPercent}%` }} /></div><div className="barText">{state.dailyXp} / {DAILY_GOAL}</div></section>
    <section className="panel compact"><div className="smallTitle">XP</div><div className="progress"><span style={{ width: `${xpPercent}%` }} /></div><div className="barText">{state.xp} / {xpNeeded}</div></section>
    <section className="panel statsPanel">
      <StatLine label="STR" value={state.stats.str} />
      <StatLine label="INT" value={state.stats.int} />
      <StatLine label="EGO" value={state.level >= 3 ? state.stats.ego : "LOCKED"} />
      <StatLine label="AURA" value={state.level >= 5 ? state.stats.aura : "LOCKED"} />
    </section>
    <button className="danger" onClick={resetLocal}>Reset local test state</button>
  </ScreenFrame>;
}

function StatLine({ label, value }: { label: string; value: number | string }) {
  return <div className="statLine"><span>{label}</span><b>{value}</b></div>;
}

function QuestScreen({ title, subtitle, quests, completed, onComplete, extra }: { title: string; subtitle: string; quests: Quest[]; completed: Record<string, string>; onComplete: (q: Quest) => void; extra?: React.ReactNode }) {
  return <ScreenFrame title={title} subtitle={subtitle}><QuestBlock title="OBJECTIVES" quests={quests} completed={completed} onComplete={onComplete} />{extra}</ScreenFrame>;
}

function QuestBlock({ title, quests, completed, onComplete }: { title: string; quests: Quest[]; completed: Record<string, string>; onComplete: (q: Quest) => void }) {
  const today = todayKey();
  return <section className="panel"><div className="tag">{title}</div>{quests.map((q) => {
    const done = completed[q.id] === today;
    return <div className={`questRow ${done ? "done" : ""}`} key={q.id}><div><b>{q.title}</b><p>+{q.xp} XP {q.stat ? `+ ${q.stat.toUpperCase()}` : ""}</p></div><button onClick={() => onComplete(q)} disabled={done}>{done ? "✓" : "+"}</button></div>;
  })}</section>;
}

function PenaltyScreen({ state, onPenalty }: { state: PlayerState; onPenalty: (id: string) => void }) {
  return <ScreenFrame title="PENALTY ZONE" subtitle="[CONTROL YOURSELF]"><section className="panel">{penalties.map((p) => <div className="questRow" key={p.id}><div><b>{p.title}</b><p>-50 XP / -1 all stats [{state.penalties[p.id] || 0}]</p></div><button onClick={() => onPenalty(p.id)}>+</button></div>)}</section></ScreenFrame>;
}

function TaskBoardScreen({ tasks, completed, onComplete, newTask, setNewTask, addTask }: { tasks: Quest[]; completed: Record<string, string>; onComplete: (q: Quest) => void; newTask: string; setNewTask: (v: string) => void; addTask: () => void }) {
  return <ScreenFrame title="TASK BOARD" subtitle="[DAILY OBJECTIVES]"><QuestBlock title="TODAY" quests={tasks} completed={completed} onComplete={onComplete} /><section className="panel inputRow"><input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Write custom task" /><button onClick={addTask}>Add</button></section></ScreenFrame>;
}

function SimpleScreen({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return <ScreenFrame title={title} subtitle={subtitle}><section className="panel">{children}</section></ScreenFrame>;
}

function ListEditor({ title, subtitle, placeholder, items, value, setValue, add }: { title: string; subtitle: string; placeholder: string; items: string[]; value: string; setValue: (v: string) => void; add: () => void }) {
  return <ScreenFrame title={title} subtitle={subtitle}><section className="panel inputRow"><input value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} /><button onClick={add}>Add</button></section><section className="panel">{items.length === 0 ? <p className="muted">No entries yet.</p> : items.map((item, index) => <div className="listItem" key={`${item}-${index}`}>{item}</div>)}</section></ScreenFrame>;
}

function StatCards({ items }: { items: string[] }) {
  return <div className="cardGrid">{items.map((i) => <div className="miniCard" key={i}>{i}</div>)}</div>;
}
