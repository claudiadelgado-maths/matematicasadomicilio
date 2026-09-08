import {prefixes,magnitudes,convert,decimal,scientific,unitLabel} from './motor.mjs';
import {$,math,quantity,feedback,renderStatic} from './ui.mjs';
renderStatic();
function options(){const m=$('magnitude').value;for(const id of ['from','to']){const selected=$(id).value;$(id).replaceChildren();for(const p of prefixes){const option=document.createElement('option');option.value=p.id;option.textContent=`${p.name} · ${unitLabel(m,p.id)}`;$(id).append(option);}if(m==='tiempo'){const option=document.createElement('option');option.value='min';option.textContent='minuto · min';$(id).append(option);}$(id).value=[...$(id).options].some(o=>o.value===selected)?selected:'0';}clear();}
function clear(){feedback();$('conversion').hidden=true;$('amount').removeAttribute('aria-invalid');}
for(const m of magnitudes){const option=document.createElement('option');option.value=m.id;option.textContent=`${m.name} · ${m.unit} (${m.unitSymbol})`;$('magnitude').append(option);}
$('magnitude').value='corriente';options();$('from').value='-3';$('to').value='0';
$('magnitude').addEventListener('change',options);for(const id of ['from','to','amount'])$(id).addEventListener('input',clear);
$('swap').addEventListener('click',()=>{const from=$('from').value;$('from').value=$('to').value;$('to').value=from;clear();});
$('converter-form').addEventListener('submit',event=>{
  event.preventDefault();try{
    const m=$('magnitude').value,from=$('from').value,to=$('to').value,input=$('amount').value.trim().replace(',','.'),answer=convert(input,from,to,m),d=decimal(answer),s=scientific(answer),origin=unitLabel(m,from),destination=unitLabel(m,to);
    const normalized=decimal(convert(input,from,from,m)).text,relation=d.approx?'\\approx':'=';
    math($('conversion-equation'),`${quantity(normalized,origin)}${relation}${quantity(d.text,destination)}`);
    let operation;
    if(from==='min'||to==='min'){
      const f=from==='min'?'60':`10^{${from}}`,t=to==='min'?'60':`10^{${to}}`;
      operation=`${normalized}\\times\\frac{${f}}{${t}}${relation}${d.text}`;
    }else operation=`${normalized}\\times10^{${from}-(${to})}=${normalized}\\times10^{${Number(from)-Number(to)}}${relation}${d.text}`;
    math($('conversion-work'),quantity(operation,destination));math($('conversion-scientific'),`${s.approx?'\\approx ':''}${quantity(s.tex,destination)}`);
    $('conversion-decimal').textContent=`${d.approx?'≈ ':''}${d.text} ${destination}`;
    $('rounding').textContent=d.approx?'La expansión decimal es periódica: se muestran 24 cifras significativas.':s.approx?'La equivalencia decimal es exacta; la notación científica está redondeada a 16 cifras significativas.':'Conversión exacta.';
    $('conversion').hidden=false;feedback();$('amount').removeAttribute('aria-invalid');
  }catch(error){$('conversion').hidden=true;feedback(error.message,false);$('amount').setAttribute('aria-invalid','true');$('amount').focus();}
});
