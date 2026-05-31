// Hovering any element of a research thread lights up that whole thread
// across the page (and dims the other one). Glow lives here, not at rest.
const threadEls = document.querySelectorAll(".interp, .bio");

threadEls.forEach((el) => {
  const thread = el.classList.contains("interp") ? "interp" : "bio";
  el.addEventListener("mouseenter", () => {
    document.body.classList.remove("lit-interp", "lit-bio");
    document.body.classList.add(`lit-${thread}`);
  });
  el.addEventListener("mouseleave", () => {
    document.body.classList.remove(`lit-${thread}`);
  });
});
