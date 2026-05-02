'use client'

import { useEffect, useState } from "react";

type Screen = "status" | "gym" | "hygiene" | "work";

type Task = {
  id: string;
  text: string;
  x: number;
  y: number;
};

export default function Page() {
  const [screen, setScreen] = useState<Screen>("status");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
const today = new Date().toDateString();
const [tasksDone, setTasksDone] = useState<Record<string, boolean>>({});

const [abilityPoints, setAbilityPoints] = useState(0);

const [stats, setStats] = useState({
  str: 0,
  vit: 0,
  agi: 0,
  int: 0,
  per: 0,
});

const level = Math.floor(xp / 1000) + 1;

const maxHp = 100 + stats.vit * 10;
const currentHp = maxHp;
const hpPercent = (currentHp / maxHp) * 100;

const xpPercent = (xp % 1000) / 1000 * 100;

useEffect(() => {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("date");
  const savedXP = localStorage.getItem("xp");
  const savedTasks = localStorage.getItem("tasks");
  const savedStats = localStorage.getItem("stats");
  const savedPoints = localStorage.getItem("points");

  if (savedXP) setXp(Number(savedXP));
  if (savedStats) setStats(JSON.parse(savedStats));
  if (savedPoints) setAbilityPoints(Number(savedPoints));

  if (savedDate !== today) {
    localStorage.setItem("date", today);
    localStorage.setItem("tasks", "{}");
    setTasksDone({});
  } else {
    if (savedTasks) setTasksDone(JSON.parse(savedTasks));
  }
}, []);
function upgradeStat(stat: keyof typeof stats) {
  if (abilityPoints <= 0) return;

  const newStats = {
    ...stats,
    [stat]: stats[stat] + 1,
  };

  const newPoints = abilityPoints - 1;

  setStats(newStats);
  setAbilityPoints(newPoints);

  localStorage.setItem("stats", JSON.stringify(newStats));
  localStorage.setItem("points", String(newPoints));
}

function completeTask(id: string) {
  if (tasksDone[id]) return;

  const newXP = xp + 20;
if (Math.floor(newXP / 1000) > Math.floor(xp / 1000)) {
  setAbilityPoints(prev => prev + 3);
}
  const newTasks = { ...tasksDone, [id]: true };

  setXp(newXP);
  setTasksDone(newTasks);

  localStorage.setItem("xp", String(newXP));
  localStorage.setItem("tasks", JSON.stringify(newTasks));

  const allTasksDone = Object.values(newTasks).every(v => v === true);

  // 🔒 da se streak poveća SAMO JEDNOM
  if (allTasksDone && !tasksDone["__done__"]) {
    setStreak(prev => prev + 1);

    // označi da je dan već završen
    setTasksDone({
      ...newTasks,
      "__done__": true
    });
  }
}
  function Checkbox({ task, small }: { task: Task; small?: boolean }) {
    return (
      <div style={{
        position: "absolute",
        zIndex: 20,
        top: task.y,
left: "50%",
transform: "translateX(-50%)",
marginLeft: `${task.x - 440}px`,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "cyan",
        textShadow: "0 0 10px cyan"
      }}>
<input
  type="checkbox"
  checked={tasksDone[task.id] || false}
  onChange={() => completeTask(task.id)}
  style={{
    transform: small ? "scale(0.6)" : "scale(1)",
    accentColor: "cyan"
  }}
/>
        <span>{task.text}</span>
      </div>
    );
  }

const gymTasks: Task[] = [
  { id: "pushups", text: "", x: 635, y: 175 },
  { id: "situps", text: "", x: 635, y: 205 },
  { id: "squats", text: "", x: 635, y: 235 },
  { id: "running", text: "", x: 635, y: 265 },
];
const gymPlan: Task[] = [
  { id: "bench", text: "", x: 350, y: 365 },
  { id: "incline", text: "", x: 350, y: 383 },
  { id: "shoulder", text: "", x: 350, y: 401 },
  { id: "lateral", text: "", x: 350, y: 419 },
  { id: "triceps", text: "", x: 350, y: 437 },
  { id: "dips", text: "", x: 350, y: 455 },
];
const gymPlanDay2: Task[] = [
  { id: "day2_1", text: "", x: 505, y: 365 },
  { id: "day2_2", text: "", x: 505, y: 383 },
  { id: "day2_3", text: "", x: 505, y: 401 },
  { id: "day2_4", text: "", x: 505, y: 419 },
  { id: "day2_5", text: "", x: 505, y: 437 },
  { id: "day2_6", text: "", x: 505, y: 455 },
];
const gymPlanDay3: Task[] = [
  { id: "day3_1", text: "", x: 665, y: 365 },
  { id: "day3_2", text: "", x: 665, y: 383 },
  { id: "day3_3", text: "", x: 665, y: 401 },
  { id: "day3_4", text: "", x: 665, y: 419 },
  { id: "day3_5", text: "", x: 665, y: 437 },
  { id: "day3_6", text: "", x: 665, y: 455 },
];
const gymPlanDay4: Task[] = [
  { id: "day4_1", text: "", x: 350, y: 525 },
  { id: "day4_2", text: "", x: 350, y: 543 },
  { id: "day4_3", text: "", x: 350, y: 561 },
  { id: "day4_4", text: "", x: 350, y: 579 },
  { id: "day4_5", text: "", x: 350, y: 597 },
  { id: "day4_6", text: "", x: 350, y: 615 },
];
const gymPlanDay5: Task[] = [
  { id: "day5_1", text: "", x: 508, y: 520 },
  { id: "day5_2", text: "", x: 508, y: 538 },
  { id: "day5_3", text: "", x: 508, y: 556 },
  { id: "day5_4", text: "", x: 508, y: 574 },
  { id: "day5_5", text: "", x: 508, y: 592 },
  { id: "day5_6", text: "", x: 508, y: 610 },
];
const gymPlanDay6: Task[] = [
  { id: "day6_1", text: "", x: 670, y: 520 },
  { id: "day6_2", text: "", x: 670, y: 538 },
  { id: "day6_3", text: "", x: 670, y: 556 },
  { id: "day6_4", text: "", x: 670, y: 574 },
  { id: "day6_5", text: "", x: 670, y: 592 },
  { id: "day6_6", text: "", x: 670, y: 610 },
];
const gymPlanDay7: Task[] = [
  { id: "day7_1", text: "", x: 405, y: 670 },
  { id: "day7_2", text: "", x: 405, y: 688 },
  { id: "day7_3", text: "", x: 405, y: 706 },

  { id: "day7_4", text: "", x: 630, y: 670 },
  { id: "day7_5", text: "", x: 630, y: 688 },
  { id: "day7_6", text: "", x: 630, y: 706 },
];


const hygieneTasks: Task[] = [
  // 👇 PRVIH 7 (manji razmak ~30px)
  { id: "h1", text: "", x: 650, y: 180 },
  { id: "h2", text: "", x: 650, y: 210 },
  { id: "h3", text: "", x: 650, y: 240 },
  { id: "h4", text: "", x: 650, y: 270 },
  { id: "h5", text: "", x: 650, y: 300 },
  { id: "h6", text: "", x: 650, y: 330 },
   { id: "h7", text: "", x: 650, y: 360 },
  { id: "h8", text: "", x: 650, y: 455 },
  { id: "h9", text: "", x: 650, y: 482 },
  { id: "h10", text: "", x: 650, y: 509 },
  { id: "h11", text: "", x: 650, y: 536 },
  { id: "h12", text: "", x: 650, y: 563 },
  { id: "h13", text: "", x: 650, y: 590 },
  { id: "h14", text: "", x: 650, y: 617 },
];

const workTasks: Task[] = [
  { id: "w1", text: "", x: 650, y: 175 },
  { id: "w2", text: "", x: 650, y: 225 },
  { id: "w3", text: "", x: 650, y: 275 },
  { id: "w4", text: "", x: 650, y: 325 },
  { id: "w5", text: "", x: 650, y: 375 },
  { id: "w6", text: "", x: 650, y: 660 },
  { id: "w7", text: "", x: 650, y: 688 },
  { id: "w8", text: "", x: 650, y: 716 },
  { id: "w9", text: "", x: 650, y: 744 },
  { id: "w10", text: "", x: 650, y: 772 },
];
function getBackground() {
  if (screen === "status") return "/status.png";
  if (screen === "gym") return "/gym.png";
  if (screen === "hygiene") return "/hygiene.png";
  return "/work.png";
}

return (
  <div style={{
    height: "100vh",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
alignItems: "flex-start"
  }}>
    <div style={{
      position: "fixed",
      top: 10,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 10,
      display: "flex",
      gap: "10px"
    }}>        <button onClick={() => setScreen("status")}>STATUS</button>
        <button onClick={() => setScreen("gym")}>GYM</button>
        <button onClick={() => setScreen("hygiene")}>HYGIENE</button>
        <button onClick={() => setScreen("work")}>WORK</button>
      </div>

      {/* BACKGROUND */}


      <div style={{
width: "900px",
maxWidth: "100%",
height: "900px",
aspectRatio: "9 / 9",

backgroundImage: `url(${getBackground()})`,
backgroundSize: "contain",
backgroundRepeat: "no-repeat",
backgroundPosition: "center",
backgroundColor: "black",
position: "relative"
      }}>
{screen === "status" && (
  <>
    <div style={{
      position: "absolute",
      top: 130,
      left: "50%",
      transform: "translateX(-50%)",
      fontSize: "50px",
      fontWeight: "bold",
      color: "cyan",
      textShadow: "0 0 20px cyan",
      zIndex: 10
    }}>
      {level}
    </div>

    <div style={{
      position: "absolute",
      top: 355,
      left: "50%",
      transform: "translateX(-50%)",
      marginLeft: "110px",
      color: "cyan",
      textShadow: "0 0 10px cyan",
      fontSize: "20px",
      display: "flex",
      gap: "5px",
      alignItems: "center"
    }}>
      <span>{currentHp}</span>
      <span>/</span>
      <span>{maxHp}</span>
    </div>
  </>
)}        {/* XP HUD */}
{screen === "status" && (
  <div style={{
    position: "absolute",
    top: 339,   // pomakni da sjedne na HP liniju
left: "50%",
transform: "translateX(-50%)",
marginLeft: "25px",
    width: "220px",
    height: "12px",
    background: "rgba(0,255,255,0.2)",
    borderRadius: "6px",
    overflow: "hidden"
  }}>
    <div style={{
      width: `${hpPercent}%`,
      height: "100%",
      background: "cyan",
      boxShadow: "0 0 10px cyan"
    }} />
  </div>
)}
{screen === "status" && (
  <div style={{
    position: "absolute",
    top: 425,
left: "50%",
transform: "translateX(-50%)",
marginLeft: "25px",
    width: "220px",
    height: "12px",
    background: "rgba(0,255,255,0.2)",
    borderRadius: "6px",
    overflow: "hidden"
  }}>
    <div style={{
      width: `${xpPercent}%`,
      height: "100%",
      background: "cyan",
      boxShadow: "0 0 10px cyan"
    }} />
  </div>
)}
{screen === "status" && (
  <div style={{
    position: "absolute",
    top: 440,
left: "50%",
transform: "translateX(-50%)",
marginLeft: "110px",
    color: "cyan",
    textShadow: "0 0 10px cyan",
    fontSize: "22px",
    zIndex: 10
  }}>
    {xp % 1000} / 1000
  </div>
)}
{screen === "status" && (
  <>
    <div style={{ 
position: "absolute", 
top: 650, 
left: "50%",
transform: "translateX(-50%)",
marginLeft: "100px", 
color: "cyan", 
textShadow: "0 0 10px cyan", 
fontSize: "30px", 
zIndex: 10 }}>
      {abilityPoints}
    </div>

    <div
onClick={() => upgradeStat("str")}
  style={{
    position: "absolute",
    top: 510,
left: "50%",
transform: "translateX(-50%)",
marginLeft: "-10px",
    color: "cyan",
    textShadow: "0 0 10px cyan",
    fontSize: "30px",
    zIndex: 10,
    cursor: "pointer"
  }}
>
  {stats.str}
</div>

<div
onClick={() => upgradeStat("vit")}
  style={{
    position: "absolute",
    top: 565,
left: "50%",
transform: "translateX(-50%)",
marginLeft: "-10px",
    color: "cyan",
    textShadow: "0 0 10px cyan",
    fontSize: "30px",
    zIndex: 10,
    cursor: "pointer"
  }}
>
  {stats.vit}
</div>

<div
onClick={() => upgradeStat("agi")}
  style={{
    position: "absolute",
    top: 625,
left: "50%",
transform: "translateX(-50%)",
marginLeft: "-10px",
    color: "cyan",
    textShadow: "0 0 10px cyan",
    fontSize: "30px",
    zIndex: 10,
    cursor: "pointer"
  }}
>
  {stats.agi}
</div>

<div
onClick={() => upgradeStat("int")}
  style={{
    position: "absolute",
    top: 680,
left: "50%",
transform: "translateX(-50%)",
marginLeft: "-10px",
    color: "cyan",
    textShadow: "0 0 10px cyan",
    fontSize: "30px",
    zIndex: 10,
    cursor: "pointer"
  }}
>
  {stats.int}
</div>
<div
onClick={() => upgradeStat("per")}
  style={{
    position: "absolute",
    top: 745,
left: "50%",
transform: "translateX(-50%)",
marginLeft: "-10px",
    color: "cyan",
    textShadow: "0 0 10px cyan",
    fontSize: "30px",
    zIndex: 10,
    cursor: "pointer"
  }}
>
  {stats.per}
</div>
  </>
)}
        <div style={{
          position: "absolute",
          top: 20,
          right: 20,
          color: "cyan",
          fontSize: "20px",
          textShadow: "0 0 10px cyan"
        }}>
          
        </div>

        {/* TASKS */}
        {screen === "gym" && gymTasks.map(t => <Checkbox key={t.id} task={t} />)}
        {screen === "gym" && gymPlan.map(t => <Checkbox key={t.id} task={t} small />)}
        {screen === "gym" && gymPlanDay2.map(t => <Checkbox key={t.id} task={t} small />)}
        {screen === "gym" && gymPlanDay3.map(t => <Checkbox key={t.id} task={t} small />)}
        {screen === "gym" && gymPlanDay4.map(t => <Checkbox key={t.id} task={t} small />)}
        {screen === "gym" && gymPlanDay5.map(t => <Checkbox key={t.id} task={t} small />)}
        {screen === "gym" && gymPlanDay6.map(t => <Checkbox key={t.id} task={t} small />)}
        {screen === "gym" && gymPlanDay7.map(t => <Checkbox key={t.id} task={t} small />)}
        
{screen === "gym" && (
  <>
    <div style={{ position: "absolute", left: "50%",
transform: "translateX(-50%)",
marginLeft: "-105px", top: 756, color: "cyan" }}>
      {streak}
    </div>

    <div style={{ position: "absolute", left: "50%",
transform: "translateX(-50%)",
marginLeft: "35px", top: 756, color: "cyan" }}>
      {level}
    </div>

    <div style={{ position: "absolute", left: "50%",
transform: "translateX(-50%)",
marginLeft: "190px", top: 756, color: "cyan" }}>
      {xp} / 1000
    </div>
  </>
)}
{screen === "work" && (
  <>
    <div style={{ position: "absolute", left: "50%",
transform: "translateX(-50%)",
marginLeft: "-115px", top: 465, color: "cyan" }}>
      {streak}
    </div>

    <div style={{ position: "absolute", left: "50%",
transform: "translateX(-50%)",
marginLeft: "45px", top: 465, color: "cyan" }}>
      {level}
    </div>

    <div style={{ position: "absolute", left: "50%",
transform: "translateX(-50%)",
marginLeft: "195px", top: 465, color: "cyan" }}>
      {xp} / 1000
    </div>
  </>
)}
        {screen === "hygiene" && hygieneTasks.map(t => <Checkbox key={t.id} task={t} />)}

        {screen === "work" && workTasks.map(t => <Checkbox key={t.id} task={t} />)}

      </div>
    </div>
  );
}