export const MODES=['aleatorio','tema','cada'];
export function shuffled(items,rng=Math.random){
 const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;
}
export function createState(){return {schema:1,cycle:1,seen:[],attempt:null};}
export function remaining(bank,state,topicId){const seen=new Set(state.seen);return bank.filter(q=>!seen.has(q.id)&&(!topicId||q.topicId===topicId));}
export function startRound(state,bank,topics,{mode,topicId=null,length=20},rng=Math.random){
 if(state.attempt&&!state.attempt.finished)throw new Error('Termina la ronda en curso antes de cambiar.');
 if(!MODES.includes(mode)||mode==='tema'&&!topics.some(t=>t.id===topicId))throw new RangeError('Modo o tema no válido.');
 if(length!=='todas'&&(!Number.isInteger(length)||length<1))throw new RangeError('Cantidad no válida.');
 const pool=remaining(bank,state,mode==='tema'?topicId:null);
 if(!pool.length)return null;
 const selected=mode==='cada'?shuffled(topics,rng).flatMap(t=>{const choices=pool.filter(q=>q.topicId===t.id);return choices.length?[shuffled(choices,rng)[0]]:[];}):shuffled(pool,rng).slice(0,length==='todas'?pool.length:length);
 const orders=Object.fromEntries(selected.map(q=>[q.id,shuffled(q.choices.map(c=>c.id),rng)]));
 return {...state,attempt:{mode,topicId:mode==='tema'?topicId:null,ids:selected.map(q=>q.id),orders,index:0,records:[],finished:false}};
}
export function currentQuestion(state,bank){return state.attempt&&!state.attempt.finished?bank.find(q=>q.id===state.attempt.ids[state.attempt.index]):null;}
export function submitAnswer(state,bank,choiceId){
 const q=currentQuestion(state,bank),a=state.attempt;
 if(!q||a.records.some(r=>r.id===q.id)||state.seen.includes(q.id)||!q.choices.some(c=>c.id===choiceId))return null;
 return {...state,seen:[...state.seen,q.id],attempt:{...a,records:[...a.records,{id:q.id,choiceId}]}};
}
export function advance(state){
 const a=state.attempt;if(!a||a.finished||!a.records.some(r=>r.id===a.ids[a.index]))return null;
 return {...state,attempt:{...a,...(a.index===a.ids.length-1?{finished:true}:{index:a.index+1})}};
}
export function closeRound(state){
 const a=state.attempt;if(!a||a.finished||!a.records.some(r=>r.id===a.ids[a.index]))return null;
 const ids=a.ids.slice(0,a.index+1),orders=Object.fromEntries(ids.map(id=>[id,a.orders[id]]));
 return {...state,attempt:{...a,ids,orders,finished:true}};
}
export function newCycle(state,bank){
 if(remaining(bank,state).length||state.attempt&&!state.attempt.finished)return null;
 return {...createState(),cycle:state.cycle+1};
}
export function summarize(attempt,bank,topics){
 const lookup=new Map(bank.map(q=>[q.id,q]));
 const records=attempt.records.map(r=>({...r,question:lookup.get(r.id),correct:lookup.get(r.id).correctId===r.choiceId}));
 const correct=records.filter(r=>r.correct).length;
 return {records,correct,total:records.length,percent:records.length?Math.round(correct/records.length*100):0,
  topics:topics.map(t=>({...t,total:records.filter(r=>r.question.topicId===t.id).length,correct:records.filter(r=>r.question.topicId===t.id&&r.correct).length})).filter(t=>t.total)};
}
// Recover only known IDs and coherent rounds. A malformed round never clears valid history.
export function restoreState(raw,bank,topics){
 const state=createState(),lookup=new Map(bank.map(q=>[q.id,q]));
 if(!raw||raw.schema!==1)return state;
 state.cycle=Number.isSafeInteger(raw.cycle)&&raw.cycle>0?raw.cycle:1;
 state.seen=[...new Set(Array.isArray(raw.seen)?raw.seen.filter(id=>lookup.has(id)):[])];
 const a=raw.attempt;if(!a||!MODES.includes(a.mode)||!Array.isArray(a.ids)||!a.ids.length||new Set(a.ids).size!==a.ids.length||!a.ids.every(id=>lookup.has(id)))return state;
 if(a.mode==='tema'&&!topics.some(t=>t.id===a.topicId)||!Number.isInteger(a.index)||a.index<0||a.index>=a.ids.length||typeof a.finished!=='boolean'||!Array.isArray(a.records)||a.records.length>a.ids.length)return state;
 if(a.mode==='tema'&&!a.ids.every(id=>lookup.get(id).topicId===a.topicId)||a.mode==='cada'&&new Set(a.ids.map(id=>lookup.get(id).topicId)).size!==a.ids.length)return state;
 if(!a.records.every((r,i)=>r&&r.id===a.ids[i]&&lookup.get(r.id).choices.some(c=>c.id===r.choiceId)))return state;
 if(a.finished?a.records.length!==a.ids.length:![a.index,a.index+1].includes(a.records.length))return state;
 const recorded=new Set(a.records.map(r=>r.id));if(a.ids.some(id=>state.seen.includes(id)&&!recorded.has(id)))return state;
 const orders={};for(const id of a.ids){const expected=lookup.get(id).choices.map(c=>c.id),order=a.orders?.[id];orders[id]=Array.isArray(order)&&order.length===expected.length&&new Set(order).size===expected.length&&order.every(c=>expected.includes(c))?[...order]:expected;}
 state.seen=[...new Set([...state.seen,...recorded])];
 state.attempt={mode:a.mode,topicId:a.mode==='tema'?a.topicId:null,ids:[...a.ids],orders,index:a.index,records:a.records.map(r=>({id:r.id,choiceId:r.choiceId})),finished:a.finished};return state;
}
