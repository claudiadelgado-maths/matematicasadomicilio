import {VERSION,mission} from './modelo.mjs';
export const newState=seed=>({version:VERSION,seed,started:false,index:0,picks:Array(24).fill(null),wrong:[],mode:'mission',reviewIndex:0,reviewPicks:{}});
const goodPick=(value,card)=>Number.isInteger(value)&&value>=0&&value<card.options.length;
const isRight=(value,card)=>goodPick(value,card)&&card.options[value]===card.answer;
export function restore(raw,fallbackSeed){
  if(raw?.version!==VERSION||!Number.isInteger(raw.seed)||raw.seed<0||raw.seed>4294967295)return newState(fallbackSeed);
  const state=newState(raw.seed),cards=mission(raw.seed);
  state.started=raw.started===true;
  if(Array.isArray(raw.picks))state.picks=cards.map((c,i)=>goodPick(raw.picks[i],c)?raw.picks[i]:null);
  // A stored cursor cannot skip unanswered cards.
  let prefix=0;while(prefix<24&&isRight(state.picks[prefix],cards[prefix]))prefix++;
  state.index=Math.min(Number.isInteger(raw.index)?Math.max(raw.index,0):0,prefix);
  state.wrong=Array.isArray(raw.wrong)?[...new Set(raw.wrong.filter(i=>Number.isInteger(i)&&i>=0&&i<24&&i<=state.index))].sort((a,b)=>a-b):[];
  if(raw.reviewPicks && typeof raw.reviewPicks==='object')for(const i of state.wrong)if(goodPick(raw.reviewPicks[i],cards[i]))state.reviewPicks[i]=raw.reviewPicks[i];
  if(raw.mode==='review'&&state.index===24&&state.wrong.length){
    state.mode='review';let prefix=0;while(prefix<state.wrong.length&&isRight(state.reviewPicks[state.wrong[prefix]],cards[state.wrong[prefix]]))prefix++;
    state.reviewIndex=Math.min(Number.isInteger(raw.reviewIndex)?Math.max(0,raw.reviewIndex):0,prefix);
  }
  return state;
}
export function current(state){return state.mode==='review'?state.wrong[state.reviewIndex]:state.index;}
export function selected(state){const i=current(state);return state.mode==='review'?state.reviewPicks[i]:state.picks[i];}
export function answer(state,choice,cards){
  const i=current(state),card=cards[i];if(!card||!goodPick(choice,card))return false;
  if(state.mode==='review')state.reviewPicks[i]=choice;else state.picks[i]=choice;
  const correct=isRight(choice,card);
  if(!correct&&!state.wrong.includes(i))state.wrong.push(i);
  return correct;
}
export function advance(state,cards){
  const i=current(state);if(!cards[i]||!isRight(selected(state),cards[i]))return false;
  if(state.mode==='review')state.reviewIndex++;else state.index++;
  return true;
}
export function startReview(state){if(state.index!==24||!state.wrong.length)return false;state.mode='review';state.reviewIndex=0;state.reviewPicks={};return true;}
