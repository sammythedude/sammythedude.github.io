(() => {
  const root = document.documentElement;
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeText = themeToggle.querySelector('.theme-text');
  const field = document.querySelector('.scramble-field');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alphabet = '01+*·<>/_{}[]';
  const geez = 'ሀሁሂሃሄህሆለሉሊላሌልሎመሙሚማሜምሞሠረሩሪራሬርሮሰሱሲሳሴስሶሸሹሻቀቁቃቄቅቆበቡቢባቤብቦተቱቲታቴትቶነኑኒናኔንኖአኡኢኣኤእኦከኩኪካኬክኮወዉዊዋዌውዎዘዙዚዛዜዝዞየዩዪያዬይዮደዱዲዳዴድዶጀገጉጊጋጌግጎፈፉፊፋፌፍፎፐፒ';
  const easterEggs = [
    'there is no war in ba sing sei',
    '42',
    'not-really-hidden-commitment',
    '🥀',
    'this website is so tuff',
    'i play jazz guitar btw'
  ];
  let characters = [];
  let messageElement;
  let matrixCells = [];
  let messageQueue = [];
  let hoverTimer;
  let dissolveTimer;
  let messageOrigin = null;
  let pointer = { x: -999, y: -999 };
  let lastTick = 0;

  function setTheme(theme) {
    root.dataset.theme = theme;
    const light = theme === 'light';
    themeText.textContent = light ? 'dark' : 'light';
    themeToggle.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} mode`);
    localStorage.setItem('samuel-theme', theme);
  }

  setTheme(localStorage.getItem('samuel-theme') || 'dark');
  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('theme-switching')) return;
    body.classList.add('theme-switching');
    setTimeout(() => setTheme(root.dataset.theme === 'light' ? 'dark' : 'light'), 210);
    setTimeout(() => body.classList.remove('theme-switching'), 680);
  });

  function randomFrom(source) { return source[Math.floor(Math.random() * source.length)]; }

  function buildField() {
    clearTimeout(hoverTimer);
    clearTimeout(dissolveTimer);
    messageOrigin = null;
    field.replaceChildren();
    characters = [];
    const spacingX = innerWidth < 700 ? 33 : 40;
    const spacingY = 30;
    const fragment = document.createDocumentFragment();
    for (let y = 18; y < innerHeight + spacingY; y += spacingY) {
      for (let x = 18; x < innerWidth + spacingX; x += spacingX) {
        const el = document.createElement('span');
        const pixelX = x + (Math.random() * 7 - 3.5);
        const pixelY = y + (Math.random() * 5 - 2.5);
        el.className = 'scramble-char';
        el.textContent = Math.random() > .36 ? randomFrom(alphabet) : '·';
        el.style.left = `${pixelX}px`;
        el.style.top = `${pixelY}px`;
        el.style.opacity = String(.3 + Math.random() * .66);
        fragment.appendChild(el);
        characters.push({ el, x: pixelX, y: pixelY });
      }
    }
    messageElement = document.createElement('div');
    messageElement.className = 'message-matrix';
    fragment.appendChild(messageElement);
    field.appendChild(fragment);
  }

  function nextMessage() {
    if (!messageQueue.length) messageQueue = [...easterEggs].sort(() => Math.random() - .5);
    return messageQueue.shift();
  }

  function dissolveMessage() {
    clearTimeout(dissolveTimer);
    if (messageElement) messageElement.classList.remove('is-revealing', 'is-warm');
    messageOrigin = null;
  }

  function wrapForMatrix(message, maxLength) {
    const words = message.split(' ');
    const lines = [''];
    words.forEach((word) => {
      const current = lines[lines.length - 1];
      if (current && `${current} ${word}`.length > maxLength) lines.push(word);
      else lines[lines.length - 1] = current ? `${current} ${word}` : word;
    });
    return lines;
  }

  function fillMessageMatrix(message) {
    const columns = innerWidth < 520 ? 28 : 36;
    const rows = 7;
    const lines = wrapForMatrix(message, columns - 6);
    const letters = new Map();
    const startRow = Math.floor((rows - lines.length) / 2);
    lines.forEach((line, lineIndex) => {
      const startColumn = Math.floor((columns - line.length) / 2);
      Array.from(line).forEach((character, columnIndex) => {
        if (character !== ' ') letters.set((startRow + lineIndex) * columns + startColumn + columnIndex, character);
      });
    });
    const fragment = document.createDocumentFragment();
    matrixCells = [];
    for (let index = 0; index < columns * rows; index += 1) {
      const cell = document.createElement('span');
      const letter = letters.get(index);
      cell.className = letter ? 'matrix-cell matrix-letter' : 'matrix-cell';
      cell.textContent = letter || randomFrom(alphabet);
      fragment.appendChild(cell);
      matrixCells.push({ element: cell, isLetter: Boolean(letter) });
    }
    messageElement.style.setProperty('--matrix-cols', columns);
    messageElement.replaceChildren(fragment);
    return { columns, rows };
  }

  function formMessage(centerX, centerY) {
    if (reduceMotion || centerX < 0 || centerY < 0) return;
    dissolveMessage();
    const message = nextMessage();
    const { columns, rows } = fillMessageMatrix(message);
    const halfWidth = columns * 4.5;
    const safeX = Math.max(halfWidth + 12, Math.min(innerWidth - halfWidth - 12, centerX));
    const halfHeight = rows * 6.5;
    const safeY = Math.max(halfHeight + 12, Math.min(innerHeight - halfHeight - 12, centerY));
    const warm = easterEggs.indexOf(message) % 2 === 1;
    messageElement.dataset.message = message;
    messageElement.style.left = `${safeX}px`;
    messageElement.style.top = `${safeY}px`;
    if (warm) messageElement.classList.add('is-warm');
    void messageElement.offsetWidth;
    messageElement.classList.add('is-revealing');
    messageOrigin = { x: centerX, y: centerY };
    dissolveTimer = setTimeout(dissolveMessage, 3400);
  }

  function animateField(time) {
    if (time - lastTick > 70) {
      characters.forEach((item) => {
        const distance = Math.hypot(item.x - pointer.x, item.y - pointer.y);
        const hot = distance < 135;
        item.el.classList.toggle('hot', hot);
        if (hot && Math.random() > .55) item.el.textContent = randomFrom(alphabet);
        else if (Math.random() > .992) item.el.textContent = randomFrom(alphabet);
      });
      if (messageElement) {
        matrixCells.forEach((cell) => {
          if (!cell.isLetter && Math.random() > .58) cell.element.textContent = randomFrom(alphabet);
        });
      }
      lastTick = time;
    }
    requestAnimationFrame(animateField);
  }

  addEventListener('pointermove', (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    clearTimeout(hoverTimer);
    if (messageOrigin && Math.hypot(pointer.x - messageOrigin.x, pointer.y - messageOrigin.y) > 12) dissolveMessage();
    hoverTimer = setTimeout(() => formMessage(pointer.x, pointer.y), 2100);
  }, { passive: true });
  addEventListener('pointerleave', () => {
    clearTimeout(hoverTimer);
    dissolveMessage();
    pointer = { x: -999, y: -999 };
  });
  addEventListener('resize', buildField, { passive: true });
  buildField();
  if (!reduceMotion) requestAnimationFrame(animateField);

  document.querySelectorAll('.interp, .bio').forEach((element) => {
    const thread = element.classList.contains('interp') ? 'interp' : 'bio';
    element.addEventListener('mouseenter', () => body.classList.add(`lit-${thread}`));
    element.addEventListener('mouseleave', () => body.classList.remove(`lit-${thread}`));
  });

  function scrambleLike(source) {
    return Array.from(source).map((character) => /[a-zA-Z]/.test(character) ? randomFrom('abcdefghijklmnopqrstuvwxyz/+-_') : character).join('');
  }

  document.querySelectorAll('.scramble').forEach((element) => {
    const original = element.textContent;
    const reveal = element.dataset.scramble || original;
    element.style.setProperty('--scramble-width', `${Math.max(original.length, reveal.length)}ch`);
    let timer;
    const run = (target, frames) => {
      clearInterval(timer);
      let frame = 0;
      timer = setInterval(() => {
        frame += 1;
        element.textContent = frame >= frames ? target : scrambleLike(original);
        if (frame >= frames) clearInterval(timer);
      }, 34);
    };
    element.addEventListener('mouseenter', () => run(reveal, 8));
    element.addEventListener('mouseleave', () => run(original, 6));
  });

  const signalTargets = {
    research: document.querySelector('#latest'),
    work: document.querySelector('#work')
  };
  let signalTimer;

  function runSignalSweep(target) {
    if (!target) return;
    clearTimeout(signalTimer);
    document.querySelectorAll('.signal-target.is-signaling').forEach((section) => section.classList.remove('is-signaling'));
    void target.offsetWidth;
    target.classList.add('is-signaling');
    signalTimer = setTimeout(() => target.classList.remove('is-signaling'), 1450);
  }

  document.querySelectorAll('.topbar nav [data-signal]').forEach((link) => {
    link.addEventListener('click', () => requestAnimationFrame(() => runSignalSweep(signalTargets[link.dataset.signal])));
  });

  const title = document.querySelector('.intro-scramble');
  if (title && !reduceMotion) {
    const finalText = title.textContent.trim();
    const gibberish = () => Array.from(finalText).map((character) => /\s/.test(character) || character === '!' ? character : randomFrom(geez)).join('');
    title.textContent = gibberish();
    let frame = 0;
    const timer = setInterval(() => {
      frame += 1;
      title.textContent = frame >= 28 ? finalText : gibberish();
      if (frame >= 28) clearInterval(timer);
    }, 55);
  }
})();
