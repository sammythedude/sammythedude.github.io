const alphabet = "abcdefghijklmnopqrstuvwxyz/+-_";

function randomText(length) {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

document.querySelectorAll(".scramble").forEach((el) => {
  const original = el.textContent;
  const target = el.dataset.scramble || original;
  let timer;

  el.addEventListener("mouseenter", () => {
    clearInterval(timer);
    let frame = 0;
    const max = 8;
    timer = setInterval(() => {
      frame += 1;
      if (frame >= max) {
        el.textContent = target;
        clearInterval(timer);
        return;
      }
      el.textContent = randomText(target.length);
    }, 34);
  });

  el.addEventListener("mouseleave", () => {
    clearInterval(timer);
    let frame = 0;
    const max = 6;
    timer = setInterval(() => {
      frame += 1;
      if (frame >= max) {
        el.textContent = original;
        clearInterval(timer);
        return;
      }
      el.textContent = randomText(original.length);
    }, 34);
  });
});
