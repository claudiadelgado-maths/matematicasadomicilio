export const storageKey='mad:elyan:tablas:v1';
export function shuffled(items,random=Math.random){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
export function optionsFor(answer,step,random=Math.random){
  const nearby=[answer-step,answer+step,answer-1,answer+1,answer-2,answer+2,answer+step*2,answer-step*2];
  const candidates=[...new Set(nearby)].filter(n=>Number.isInteger(n)&&n>=0&&n!==answer);
  return shuffled([answer,...shuffled(candidates,random).slice(0,3)],random);
}
export function cleanProgress(raw){
  if(!Array.isArray(raw))return [];
  const completed=[];
  for(let level=1;level<=10;level++){if(!raw.includes(level))break;completed.push(level);}
  return completed;
}
export function loadProgress(storage){try{return cleanProgress(JSON.parse(storage.getItem(storageKey)||'[]'));}catch{return [];}}
export function saveProgress(storage,completed){try{storage.setItem(storageKey,JSON.stringify(cleanProgress(completed)));return true;}catch{return false;}}
export function createPath(completed=[]){
  const done=new Set(cleanProgress(completed));let level=1,jumps=0,phase='ready';
  return {
    get level(){return level;},get jumps(){return jumps;},get position(){return level*jumps;},get phase(){return phase;},
    get completed(){return [...done].sort((a,b)=>a-b);},get unlocked(){return Math.min(10,done.size+1);},
    select(next){if(!Number.isInteger(next)||next<1||next>this.unlocked)return false;level=next;jumps=0;phase='ready';return true;},
    choose(value){
      if(phase!=='ready')return null;
      if(value!==level*(jumps+1)){jumps=0;phase='fallen';return false;}
      jumps++;phase=jumps===10?'complete':'moving';if(phase==='complete')done.add(level);return true;
    },
    landed(){if(phase==='moving')phase='ready';},
    restart(){jumps=0;phase='ready';}
  };
}
export function triviaRound(mode,table=1,random=Math.random){
  if(!Number.isInteger(table)||table<1||table>10)throw new RangeError('Tabla fuera del 1 al 10');
  const item=(a,b)=>({a,b,answer:a*b});
  if(mode==='ordered')return Array.from({length:10},(_,i)=>item(table,i+1));
  if(mode!=='mixed')throw new RangeError('Modalidad desconocida');
  return shuffled(Array.from({length:10},(_,i)=>shuffled([1,2,3,4,5,6,7,8,9,10],random).slice(0,2).map(b=>item(i+1,b))).flat(),random);
}
export function createTrivia(items){
  let index=0;const answers=[];
  return {
    items,get index(){return index;},get current(){return items[index];},get answered(){return answers.length>index;},
    get correct(){return answers.filter(Boolean).length;},get errors(){return answers.filter(v=>!v).length;},get count(){return answers.length;},get complete(){return answers.length===items.length;},
    choose(value){if(this.answered||this.complete)return null;const correct=value===this.current.answer;answers.push(correct);return correct;},
    next(){if(!this.answered||index===items.length-1)return false;index++;return true;}
  };
}
