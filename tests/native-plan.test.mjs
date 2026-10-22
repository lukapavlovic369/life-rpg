import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planNotices, zagrebDay} from '../app/native/notification-plan.ts';
const now=Date.parse('2026-10-22T10:00:00Z');
const base={introComplete:true,questTimers:{'side-1':{endAt:now+7200000,duration:7200000,start:now}}};
test('schedules exactly the final minute at a fixed date',()=>{
 const p=planNotices(base,now,()=> 'Short Form Content');assert.equal(p.length,1);assert.equal(p[0].at,now+7140000);assert.equal(p[0].page,'work');assert.match(p[0].body,/Short Form Content/);
});
test('early confirmation removes a work notification',()=>{assert.deepEqual(planNotices({...base,sideHustleQuests:[{id:'side-1',done:true}]},now),[])});
test('completed gym and already notified timers are not scheduled',()=>{assert.deepEqual(planNotices({...base,checks:{'side-1':true}},now),[]);assert.deepEqual(planNotices({...base,questTimers:{'side-1':{...base.questTimers['side-1'],finalMinuteNotified:true}}},now),[])});
test('expired and already due alerts are not replayed on resume',()=>{assert.deepEqual(planNotices(base,now+7200001),[])});
test('tutorial suppresses native notifications',()=>{assert.deepEqual(planNotices({...base,introComplete:false},now),[])});
test('penalty readiness uses its stored timestamp and supports cancellation',()=>{
 const q={id:'penalty-test',name:'Extreme Training',readyAt:now+86340000};const s={introComplete:true,penaltyQuests:[q]};assert.equal(planNotices(s,now)[0].at,q.readyAt);assert.equal(planNotices(s,now)[0].page,'habits');assert.deepEqual(planNotices({...s,penaltyQuests:[{...q,done:true}]},now),[]);
});
test('Zagreb midnight includes daylight saving transitions',()=>{assert.equal(zagrebDay(Date.parse('2026-10-22T22:30:00Z')),'2026-10-23');assert.equal(zagrebDay(Date.parse('2026-10-26T22:30:00Z')),'2026-10-26')});
test('iOS schedule is capped and prioritizes the next notices',()=>{
 const questTimers=Object.fromEntries(Array.from({length:80},(_,i)=>['g-'+i,{endAt:now+(i+2)*60000}]));const p=planNotices({introComplete:true,questTimers},now);assert.equal(p.length,60);assert.equal(p[0].key,'timer:g-0');assert.equal(p.at(-1).key,'timer:g-59');
});
