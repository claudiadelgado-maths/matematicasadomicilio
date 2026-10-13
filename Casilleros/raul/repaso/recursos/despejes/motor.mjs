// Each symbol occurs once, on one side, in a numerator (+1) or denominator (-1).
// Symbols are nonzero: dividing or multiplying both sides by one is reversible.
export const templates=[
 {name:'Dos cocientes',sides:[[1,-1],[1,-1]]},
 {name:'Producto arriba',sides:[[1,1,-1],[1]]},
 {name:'Producto abajo',sides:[[1,-1,-1],[1]]},
 {name:'Dos productos',sides:[[1,1,-1,-1],[1]]}
];
export function initial(index=0){let i=0;return templates[index].sides.flatMap((powers,side)=>powers.map(power=>({id:String.fromCharCode(97+i++),side,power})));}
export function move(state,id){const item=state.find(x=>x.id===id);if(!item)throw Error('Factor desconocido');return state.map(x=>x.id===id?{...x,side:1-x.side,power:-x.power}:{...x});}
export const flip=state=>state.map(x=>({...x,side:1-x.side}));
export function isolated(state,id){const x=state.find(x=>x.id===id);return x.power===1&&state.filter(y=>y.side===x.side).length===1;}
export function sideTex(state,side){const list=state.filter(x=>x.side===side),top=list.filter(x=>x.power===1).map(x=>x.id).join('\\cdot ')||'1',bottom=list.filter(x=>x.power===-1).map(x=>x.id).join('\\cdot ');return bottom?`\\frac{${top}}{${bottom}}`:top;}
export const equation=state=>sideTex(state,0)+'='+sideTex(state,1);
export function operationTex(state,id){const x=state.find(x=>x.id===id),a=sideTex(state,0),b=sideTex(state,1);return x.power===1?`\\frac{${a}}{${id}}=\\frac{${b}}{${id}}`:`${a}\\cdot ${id}=${b}\\cdot ${id}`;}
// Canonical exponents of left / right; all legal operations preserve this signature.
export const signature=state=>Object.fromEntries(state.map(x=>[x.id,x.power*(x.side===0?1:-1)]));
