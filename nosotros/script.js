(() => {
  const inbox = document.querySelector('.conversation-inbox');
  if (!inbox) return;

  const title = document.getElementById('conversation-title');
  const avatar = document.getElementById('conversation-avatar');
  const back = document.querySelector('.conversation-back');
  const conversations = new Map(
    [...inbox.querySelectorAll('.conversation-link')].map((link) => {
      const id = link.hash.slice(1);
      return [id, { link, panel: document.getElementById(id) }];
    })
  );
  let currentId = '';

  const showView = (id, moveFocus = false) => {
    const previous = conversations.get(currentId);
    const current = conversations.get(id);
    currentId = current ? id : '';

    inbox.hidden = Boolean(current);
    back.hidden = !current;
    avatar.hidden = !current;
    conversations.forEach(({ panel }, panelId) => {
      panel.hidden = panelId !== currentId;
    });

    title.textContent = current
      ? current.link.querySelector('.conversation-name').textContent
      : 'Chats';
    if (current) {
      const sourceAvatar = current.link.querySelector('.conversation-avatar');
      avatar.textContent = sourceAvatar.textContent;
      avatar.className = sourceAvatar.className;
    }
    document.title = `${title.textContent} | Matemáticas a Domicilio`;

    if (moveFocus) {
      (current ? title : previous?.link || title).focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1);
    // Los enlaces de salto al contenido no cambian de conversación.
    if (!id || id === 'chats' || conversations.has(id)) showView(id, true);
  });

  showView(window.location.hash.slice(1));
})();
