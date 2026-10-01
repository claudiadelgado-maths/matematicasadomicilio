// Web Speech no publica género ni estilo. Los nombres solo son pistas;
// Claudia puede elegir cualquier voz disponible desde el selector.
export function elegirVoz(voices) {
  const male = v => /\b(pablo|alvaro|álvaro|jorge|diego|antonio|enrique|manuel|andres|andrés|carlos|male|hombre|masculin[oa])\b/i.test(v.name);
  const spanish = v => /^es(?:[-_]|$)/i.test(v.lang);
  const spain = v => /^es[-_]es$/i.test(v.lang);
  const candidates = [voices.filter(v => spain(v) && male(v)), voices.filter(v => spanish(v) && male(v)),
    voices.filter(spain), voices.filter(spanish), voices.filter(v => v.default), voices].find(group => group.length) || [];
  const score = v => (v.localService ? 4 : 0) + (/desktop|espeak|sapi|robot/i.test(v.name) ? 3 : 0)
    - (/natural|neural|online/i.test(v.name) ? 2 : 0);
  return [...candidates].sort((a, b) => score(b) - score(a))[0] || null;
}

export function crearVoz(button, select, info) {
  const synth = window.speechSynthesis;
  let enabled = Boolean(synth && window.SpeechSynthesisUtterance), finishSpeech, started = false;
  let voices = [];
  function label(failed = false) {
    button.textContent = failed ? '🔇 Reintentar voz' : enabled ? '🔊 Voz activada' : '🔇 Voz desactivada';
    button.setAttribute('aria-pressed', String(enabled));
  }
  const chosen = () => voices.find(v => v.voiceURI === select.value) || elegirVoz(voices);
  function describe() {
    info.textContent = chosen() ? `Voz: ${chosen().name}. Tono grave de robot.` : 'Voz del dispositivo. Si no está disponible, seguimos con las pistas visuales.';
  }
  function refresh() {
    voices = synth?.getVoices() || [];
    const previous = select.value;
    select.replaceChildren(new Option('Automática · preferir masculina', 'auto'));
    voices.forEach(v => select.add(new Option(`${v.name} · ${v.lang}`, v.voiceURI)));
    select.value = voices.some(v => v.voiceURI === previous) ? previous : 'auto';
    describe();
  }
  function cancel() {
    const wasStarted = started;
    finishSpeech?.();
    if (wasStarted) synth?.cancel();
  }
  function say(text) {
    // Una nueva interacción sustituye la frase anterior, sin crear una cola.
    cancel();
    if (!enabled) return Promise.resolve();
    return new Promise(resolve => {
      let done = false;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = chosen();
      utterance.lang = utterance.voice?.lang || 'es-ES';
      utterance.rate = 1.2;
      utterance.pitch = .7;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        clearTimeout(startTimer);
        started = false;
        finishSpeech = null;
        resolve();
      };
      const fail = () => {
        if (done) return;
        finish();
        enabled = false;
        label(true);
        synth.cancel();
      };
      // Frases largas tienen más margen; nunca se deja una cola pendiente.
      const timer = setTimeout(fail, Math.max(6000, 1500 + text.length * 130));
      finishSpeech = finish;
      utterance.onend = finish;
      utterance.onerror = fail;
      // Chromium necesita liberar la locución cancelada antes de empezar otra.
      // Esta espera también se cancela: nunca quedan frases antiguas pendientes.
      const startTimer = setTimeout(() => {
        if (done) return;
        started = true;
        try { synth.speak(utterance); } catch { fail(); }
      }, 140);
    });
  }
  button.addEventListener('click', () => { enabled = !enabled; if (!enabled) cancel(); label(); });
  select.addEventListener('change', () => { cancel(); describe(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
  window.addEventListener('pagehide', cancel);
  synth?.addEventListener('voiceschanged', refresh);
  refresh();
  label();
  if (!synth || !window.SpeechSynthesisUtterance) {
    button.disabled = true;
    button.textContent = 'Voz no disponible';
    select.disabled = true;
  }
  return { say, cancel, available: Boolean(synth && window.SpeechSynthesisUtterance) };
}
