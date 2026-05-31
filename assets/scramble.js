const alphabet = "abcdefghijklmnopqrstuvwxyz/+-_";

// Scramble only letters; keep spaces and punctuation in place so the text
// keeps the same width and line-break opportunities (no paragraph reflow).
function scrambleLike(source) {
  let out = "";
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    out += /[a-zA-Z]/.test(ch)
      ? alphabet[Math.floor(Math.random() * alphabet.length)]
      : ch;
  }
  return out;
}

document.querySelectorAll(".scramble").forEach((el) => {
  const original = el.textContent;
  const target = el.dataset.scramble || original;
  let timer;

  function run(to, frames) {
    clearInterval(timer);
    let frame = 0;
    timer = setInterval(() => {
      frame += 1;
      if (frame >= frames) {
        el.textContent = to;
        clearInterval(timer);
        return;
      }
      el.textContent = scrambleLike(to);
    }, 34);
  }

  el.addEventListener("mouseenter", () => run(target, 8));
  el.addEventListener("mouseleave", () => run(original, 6));
});
