import { Capacitor, registerPlugin, type PluginListenerHandle } from '@capacitor/core';
import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';
import { planNotices, type NativeState } from './notification-plan';

interface HealthDistance { day: string; meters: number; available: boolean }
interface BeyondHealth {
  requestAccess(): Promise<{available: boolean; requestCompleted: boolean}>;
  todayDistance(): Promise<HealthDistance>;
  addListener(event: 'distanceUpdated', listener: (sample: HealthDistance) => void): Promise<PluginListenerHandle>;
}
const Health = registerPlugin<BeyondHealth>('BeyondHealth');
interface NativeWindow extends Window {
  state?: NativeState; __blAuthReady?: boolean; __blPasswordAuth?: boolean;
  __blNativeIOS?: boolean; __blNativeSyncTimers?: () => void;
  __blCancelNativeNotifications?: () => Promise<void>;
  __blResumeNativeFeatures?: () => void;
  __beyondNativeRefresh?: () => void; __beyondConnectHealth?: () => Promise<void>;
  __beyondEnableNotifications?: () => Promise<void>;
  __beyondApplyHealthDistance?: (sample: HealthDistance) => void;
  __beyondHealthStatus?: (message: string) => void;
  __beyondRunPause?: () => void;
  showPage?: (page: string) => void;
}
export function nativeIOS(): boolean { return Capacitor.getPlatform() === 'ios'; }
export function installNativeFeatures(): () => void {
  if (!nativeIOS()) return () => {};
  const w = window as NativeWindow;
  w.__blNativeIOS = true;
  let disposed=false, refreshing=false, signingOut=false, snapshot='', queue=Promise.resolve();
  let sessionEpoch=0;
  let pendingPage: {owner:string;page:string}|null=null;
  const listeners: PluginListenerHandle[]=[];
  const active = () => !signingOut && w.__blAuthReady === true && localStorage.questPlayerAccepted === '1';
  const message = (text: string) => w.__beyondHealthStatus?.(text);
  async function refreshHealth() {
    if (disposed || refreshing || !active()) return;
    refreshing=true;const owner=localStorage.beyondProfileOwner;
    try { const sample=await Health.todayDistance();if (!disposed && active() && owner === localStorage.beyondProfileOwner) w.__beyondApplyHealthDistance?.(sample); }
    catch { message('Apple Health is not connected. Tap CONNECT APPLE HEALTH.'); }
    finally {refreshing=false;}
  }
  async function reconcile() {
    if (disposed) return;
    const epoch=sessionEpoch, owner=active()?localStorage.beyondProfileOwner:null;
    const plan=owner && w.state?planNotices(w.state, Date.now(), id => {
      const s=w.state as NativeState;
      const q=[...(s.sideHustleQuests||[]),...(s.sideBonusObjectives||[]),...(s.businessQuests||[])].find(q=>q.id===id);
      return q?.title || ({'g-f1':'Push-ups','g-f2':'Sit-ups','g-f3':'Squats','g-run10':'Running'} as Record<string,string>)[id] || 'Your quest';
    }):[];
    const next=JSON.stringify({owner,plan});if(next===snapshot)return;
    let permissions=await LocalNotifications.checkPermissions();
    if(permissions.display==='prompt' && plan.length)permissions=await LocalNotifications.requestPermissions();
    const pending=await LocalNotifications.getPending();
    const ours=pending.notifications.filter(n=>n.extra?.beyondManaged===true);
    if(ours.length)await LocalNotifications.cancel({notifications:ours.map(n=>({id:n.id}))});
    if(disposed || epoch!==sessionEpoch || owner!==(active()?localStorage.beyondProfileOwner:null))return;
    if (permissions.display==='granted' && plan.length) {
      await LocalNotifications.schedule({notifications:plan.map((n,i)=>({id:710000+i,title:n.title,body:n.body,schedule:{at:new Date(n.at)},extra:{beyondManaged:true,key:n.key,page:n.page,owner}}))});
    }
    if (!disposed && epoch===sessionEpoch) snapshot=next;
  }
  function syncTimers(){queue=queue.then(reconcile,reconcile).catch(()=>{snapshot='';});}
  w.__blNativeSyncTimers=syncTimers;
  w.__blCancelNativeNotifications=async()=>{signingOut=true;sessionEpoch++;snapshot='';syncTimers();await queue;};
  w.__blResumeNativeFeatures=()=>{signingOut=false;snapshot='';syncTimers();void refreshHealth();};
  w.__beyondNativeRefresh=()=>{void refreshHealth();syncTimers();};
  w.__beyondConnectHealth=async()=>{
    try {const result=await Health.requestAccess();if(!result.available){message('Apple Health is unavailable on this device.');return;}await refreshHealth();}
    catch {message('Enable walking and running distance for Beyond Leveling in Health settings.');}
  };
  w.__beyondEnableNotifications=async()=>{
    try {const permission=await LocalNotifications.requestPermissions();snapshot='';syncTimers();message(permission.display==='granted'?'Timer notifications enabled.':'Enable notifications in iPhone Settings to receive timer alerts.');}
    catch {message('Unable to request notifications. Check iPhone Settings.');}
  };
  void Health.addListener('distanceUpdated',sample=>{if(active())w.__beyondApplyHealthDistance?.(sample);}).then(h=>{if(disposed)void h.remove();else listeners.push(h);}).catch(()=>{});
  void App.addListener('appStateChange',event=>{if(event.isActive){snapshot='';void refreshHealth();}syncTimers();}).then(h=>{if(disposed)void h.remove();else listeners.push(h);}).catch(()=>{});
  void LocalNotifications.addListener('localNotificationActionPerformed',event=>{
    const extra=event.notification.extra;
    if(!extra?.beyondManaged || !['gym','work','business','tasks','habits','status'].includes(extra.page))return;
    pendingPage={owner:String(extra.owner||''),page:extra.page};
  }).then(h=>{if(disposed)void h.remove();else listeners.push(h);}).catch(()=>{});
  let previousOwner=localStorage.beyondProfileOwner;
  const timer=window.setInterval(()=>{
    const owner=active()?localStorage.beyondProfileOwner:null;
    if(owner!==previousOwner){previousOwner=owner;sessionEpoch++;snapshot='';}
    if(pendingPage && active()){
      if(pendingPage.owner===owner)w.showPage?.(pendingPage.page);
      pendingPage=null;
    }
    syncTimers();
  },1000);
  const healthTimer=window.setInterval(()=>void refreshHealth(),30_000);
  void refreshHealth();syncTimers();
  return ()=>{disposed=true;clearInterval(timer);clearInterval(healthTimer);listeners.forEach(h=>void h.remove());delete w.__blNativeSyncTimers;delete w.__beyondNativeRefresh;delete w.__beyondConnectHealth;delete w.__beyondEnableNotifications;delete w.__blCancelNativeNotifications;delete w.__blResumeNativeFeatures;};
}
