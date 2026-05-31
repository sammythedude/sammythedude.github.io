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

// One-shot reveal for the Amharic greeting: Latin gibberish (rendered in a
// mono fall-back font) resolves into the real title over ~1.6s. Unicode-safe
// via Array.from, and spaces / "!" are preserved so the shape stays steady.
// Without JS the heading just shows the Amharic — progressive enhancement.
function gibberish(source) {
  return Array.from(source)
    .map((ch) =>
      /\s/.test(ch) || ch === "!"
        ? ch
        : alphabet[Math.floor(Math.random() * alphabet.length)]
    )
    .join("");
}

const introTitle = document.querySelector(".intro-scramble");
if (introTitle) {
  const finalText = introTitle.textContent;
  introTitle.classList.add("is-scrambling");
  introTitle.textContent = gibberish(finalText);

  let frame = 0;
  const frames = 42; // ~1.6s at 38ms per frame
  const introTimer = setInterval(() => {
    frame += 1;
    if (frame >= frames) {
      introTitle.textContent = finalText;
      introTitle.classList.remove("is-scrambling");
      clearInterval(introTimer);
      return;
    }
    introTitle.textContent = gibberish(finalText);
  }, 38);
}
