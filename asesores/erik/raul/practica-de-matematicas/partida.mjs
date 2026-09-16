import {levels,makeRun} from './generador.mjs';
export class Game{
 constructor({now=()=>Date.now(),random=Math.random}={}){this.now=now;this.random=random;this.previous=new Map();this.settings=new Map();this.completed=new Set();this.choose(1);}
 choose(id){const level=levels.find(l=>l.id===Number(id));if(!level)throw Error('Nivel no encontrado');this.level=this.configuration(level.id);this.state='ready';this.problems=[];this.index=0;this.step=0;this.correct=0;this.selected=null;this.deadline=null;this.endedAt=null;}
 configuration(id){return {...levels.find(l=>l.id===Number(id)),...this.settings.get(Number(id))};}
 configure(count,seconds){if(this.state==='running')throw Error('Termina el intento antes de editar.');if(!Number.isInteger(count)||count<1||count>100||!Number.isInteger(seconds)||seconds<1||seconds>359999)throw Error('Usa de 1 a 100 problemas y un tiempo mayor que cero.');this.settings.set(this.level.id,{count,seconds});if(this.state==='ready')this.level=this.configuration(this.level.id);}
 start(){this.level=this.configuration(this.level.id);const problems=makeRun(this.level,this.random,this.previous.get(this.level.id)||[]);this.problems=problems;this.previous.set(this.level.id,problems.map(p=>p.id));this.index=0;this.step=0;this.correct=0;this.selected=null;this.state='running';this.endedAt=null;this.deadline=this.now()+this.level.seconds*1000;}
 get problem(){return this.problems[this.index];}
 get question(){return this.problem?.steps[this.step];}
 get remaining(){return this.deadline===null?this.level.seconds:Math.max(0,Math.ceil((this.deadline-(this.endedAt??this.now()))/1000));}
 tick(){if(this.state==='running'&&this.now()>=this.deadline){this.state='timeout';this.endedAt=this.deadline;return true;}return false;}
 answer(i){if(this.state!=='running')return false;if(this.tick())return false;if(!Number.isInteger(i)||!this.question.options[i])return false;this.selected=i;
  if(!this.question.options[i].correct){this.state='failed';this.endedAt=this.now();return false;}
  this.correct++;this.selected=null;
  if(this.step+1<this.problem.steps.length){this.step++;return true;}
  if(this.index+1===this.problems.length){this.state='complete';this.endedAt=this.now();this.completed.add(this.level.id);return true;}
  this.index++;this.step=0;return true;
 }
}
