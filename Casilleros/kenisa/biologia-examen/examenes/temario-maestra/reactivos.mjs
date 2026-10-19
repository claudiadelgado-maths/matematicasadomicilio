// La clave se conserva por ID; el motor mezcla las opciones al iniciar cada ronda.
export const mc=(id,covers,prompt,correct,others,explanation,figure=null)=>({id,covers:covers.split(' '),prompt,kind:'Elige la respuesta correcta',choices:[correct,...others].map((text,i)=>({id:`o${i}`,text})),correctId:'o0',explanation,figure});
export const tf=(id,covers,prompt,answer,explanation)=>({id,covers:covers.split(' '),prompt,kind:'Verdadero o falso',choices:[{id:'v',text:'Verdadero'},{id:'f',text:'Falso'}],correctId:answer?'v':'f',explanation,figure:null});
