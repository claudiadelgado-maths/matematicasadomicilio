// Herramienta editorial opcional. El sitio servido es HTML estático, sin compilación.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {pages} from './contenido.mjs';
import {markup} from './laboratorios.mjs';
const session=fileURLToPath(new URL('../',import.meta.url)),site=path.resolve(session,'../../../..');
const template=await readFile(path.join(session,'recursos/marco.txt'),'utf8');
const header=template.slice(template.indexOf('<header class="site-header">'),template.indexOf('<main'));
const footer=template.slice(template.indexOf('<footer'));
const katex=template.slice(template.indexOf('<link rel="stylesheet" href="https://cdn'),template.indexOf('<script type="module"'));
const relative=(from,to)=>path.relative(from,to).replaceAll('\\','/');
for(let i=0;i<pages.length;i++){
 const p=pages[i],dir=path.join(session,p.slug),root=relative(dir,site)+'/',resources=relative(dir,path.join(session,'recursos'))+'/',student=relative(dir,path.join(session,'../index.html'));
 await mkdir(dir,{recursive:true});
 const adjust=s=>s.replaceAll('../../../../',root).replaceAll('href="../../../index.html"',`href="${root}asesores/index.html"`);
 const body=p.body.replace(/<div data-lab="([^"]+)"><\/div>/g,(_,key)=>`<div data-lab="${key}">${markup(key)}<noscript>Activa JavaScript para explorar este diagrama. Las explicaciones de la página permanecen disponibles.</noscript></div>`);
 const previous=i?relative(dir,path.join(session,pages[i-1].slug,'index.html')):student;
 const next=i<pages.length-1?relative(dir,path.join(session,pages[i+1].slug,'index.html')):student;
 const html=`<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${p.key==='joule'?'Electricidad 3 | Raúl':p.title+' | Electricidad 3 · Raúl'}</title><meta name="description" content="${p.intro}"><meta name="theme-color" content="#e5f0f6"><link rel="icon" href="${root}recursos/svg/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${root}recursos/css/base.css"><link rel="stylesheet" href="estilos.css"><script defer src="${root}recursos/js/navegacion.js"></script>${katex}<script type="module" src="${resources}actividad.mjs"></script></head><body data-topic="${p.key}"><a class="skip-link" href="#contenido">Saltar al contenido</a>${adjust(header)}<main id="contenido" class="electric-three"><div class="lesson-wrap"><a class="student-back" href="${student}">← Sesiones de Raúl</a><header class="lesson-hero"><div class="hero-line" aria-hidden="true"></div><h1>${p.title}</h1><p>${p.intro}</p></header><article class="lesson-content" aria-label="${p.heading}">${i?'<h2>'+p.heading+'</h2>':''}${body}</article><section class="quiz" aria-labelledby="quiz-title"><h2 id="quiz-title">Comprueba la idea</h2><p class="quiz-progress"></p><p class="quiz-question" tabindex="-1"></p><div class="quiz-options"></div><p class="quiz-feedback" role="status"></p><button type="button" class="primary quiz-next" hidden>Siguiente pregunta →</button><button type="button" class="quiz-restart" hidden>Repetir el reto</button><noscript>Activa JavaScript para responder las preguntas.</noscript></section>${i===pages.length-1?'<p class="completion">Terminaste Electricidad 3. Antes de salir, elige una fórmula y explica qué pasa si cambias una de sus variables manteniendo las otras fijas.</p>':''}<nav class="lesson-nav" aria-label="Recorrido de Electricidad 3"><a href="${previous}">${i?'← Anterior':'← Sesiones de Raúl'}</a><a class="primary" href="${next}">${i<pages.length-1?'Continuar →':'Regresar a sesiones de Raúl →'}</a></nav></div></main>${adjust(footer)}`;
 await writeFile(path.join(dir,'index.html'),html+'\n');
 await writeFile(path.join(dir,'estilos.css'),`@import url('${resources}sesion.css');\n`);
 if(p.slug)await writeFile(path.join(dir,'README.md'),`# ${p.title}\n\nPágina integrada de Electricidad 3: ${p.heading}. ${p.questions.length} preguntas conceptuales con retroalimentación inmediata.\n\nContenido editorial y preguntas en ../recursos/contenido.mjs; diagrama e interacción en ../recursos/laboratorios.mjs. HTML generado por ../recursos/generar.mjs, sin compilación necesaria para servirlo. Recursos y metadatos compartidos de la sesión. Ver ../README.md para límites y pruebas.\n`);
}
console.log(`Electricidad 3: ${pages.length} páginas, ${pages.reduce((n,p)=>n+p.questions.length,0)} preguntas.`);
