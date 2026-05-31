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

// Center a short reveal inside the original word's footprint, padding with
// non-breaking spaces (which don't collapse and keep their width in a mono
// font). Every animation frame is then the same character count as the word
// it replaces, so the paragraph never reflows on hover.
function centerPad(str, len) {
  if (str.length >= len) return str;
  const pad = len - str.length;
  const left = Math.floor(pad / 2);
  return " ".repeat(left) + str + " ".repeat(pad - left);
}

document.querySelectorAll(".scramble").forEach((el) => {
  const original = el.textContent;
  const reveal = el.dataset.scramble
    ? centerPad(el.dataset.scramble, original.length)
    : original;
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

  el.addEventListener("mouseenter", () => run(reveal, 8));
  el.addEventListener("mouseleave", () => run(original, 6));
});

// One-shot "decode" for the Amharic greeting: random Ge'ez fidel shuffle —
// rendered in the same Adwa font as the final text — that resolves into the
// real title over ~1.8s. Spaces and "!" are preserved. Without JS the heading
// simply shows the Amharic (progressive enhancement).
const geez =
  "ሀሁሂሃሄህሆለሉሊላሌልሎመሙሚማሜምሞሠረሩሪራሬርሮሰሱሲሳሴስሶሸሹሻቀቁቃቄቅቆበቡቢባቤብቦተቱቲታቴትቶቸቹቻኀነኑኒናኔንኖአኡኢኣኤእኦከኩኪካኬክኮኸወዉዊዋዌውዎዐዘዙዚዛዜዝዞዠየዩዪያዬይዮደዱዲዳዴድዶጀገጉጊጋጌግጎጠጡጢጣጤጥጦጨጪጰጱጳጸጹጻጼጽጾፀፈፉፊፋፌፍፎፐፒ";

function geezGibberish(source) {
  return Array.from(source)
    .map((ch) =>
      /\s/.test(ch) || ch === "!"
        ? ch
        : geez[Math.floor(Math.random() * geez.length)]
    )
    .join("");
}

const introTitle = document.querySelector(".intro-scramble");
if (introTitle) {
  const finalText = introTitle.textContent.trim();
  introTitle.textContent = geezGibberish(finalText);

  let frame = 0;
  const frames = 30; // ~1.8s at 60ms per frame — slow enough to read as "decoding"
  const introTimer = setInterval(() => {
    frame += 1;
    if (frame >= frames) {
      introTitle.textContent = finalText;
      clearInterval(introTimer);
      return;
    }
    introTitle.textContent = geezGibberish(finalText);
  }, 60);
}
