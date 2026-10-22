export interface PlannedNotice { key: string; at: number; title: string; body: string; page: 'gym' | 'work' | 'business' | 'tasks' | 'habits' | 'status' }
type WorkQuest = { id: string; title?: string; done?: boolean };
export interface NativeState {
  introStep?: number; introComplete?: boolean; systemStartDay?: string;
  checks?: Record<string, boolean>;
  questTimers?: Record<string, { start?: number; duration?: number; endAt?: number; finalMinuteNotified?: boolean }>;
  sideHustleQuests?: WorkQuest[]; sideBonusObjectives?: WorkQuest[]; businessQuests?: WorkQuest[];
  penaltyQuests?: {id: string; name: string; readyAt: number; done?: boolean; readyNotified?: boolean}[];
}
export function zagrebDay(at: number): string {
  return new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Zagreb',year:'numeric',month:'2-digit',day:'2-digit'}).format(at);
}
export function planNotices(state: NativeState, now: number, label: (id: string) => string = id => id): PlannedNotice[] {
  if (state.introComplete !== true) return [];
  const work = [...(state.sideHustleQuests || []), ...(state.sideBonusObjectives || []), ...(state.businessQuests || [])];
  const list: PlannedNotice[] = [];
  for (const [id, timer] of Object.entries(state.questTimers || {})) {
    if (state.checks?.[id] || work.some(q => q.id === id && q.done) || timer.finalMinuteNotified) continue;
    const end = Number(timer.endAt || Number(timer.start) + Number(timer.duration));
    const at = end - 60_000;
    if (!Number.isFinite(at) || at <= now) continue;
    list.push({ key: `timer:${id}`, at, title: "DON'T DISAPPEAR.", body: `${label(id)}: your final minute starts now.`, page: id.startsWith('side-') ? 'work' : id.startsWith('biz-') ? 'business' : id.startsWith('urgent-') ? 'tasks' : 'gym' });
  }
  if (!state.systemStartDay || zagrebDay(now) >= state.systemStartDay) {
    for (const q of state.penaltyQuests || []) {
      if (q.done || q.readyNotified || !Number.isFinite(q.readyAt) || q.readyAt <= now) continue;
      list.push({key:`penalty:${q.id}`, at:q.readyAt, title:'PENALTY QUEST', body:`${q.name} is ready to confirm.`, page:'habits'});
    }
  }
  // iOS keeps a limited number of pending notifications. Reserve space for other app notices.
  return list.sort((a,b) => a.at-b.at || a.key.localeCompare(b.key)).slice(0,60);
}
