const hero = document.querySelector(".hero");
const productScene = document.querySelector("#productScene");
const heroCopy = document.querySelector(".hero-copy");
const logo = document.querySelector(".yopro-logo");
const proteinMarqueeText = document.querySelector("#proteinMarqueeText");
const proteinMarqueeMeasure = document.querySelector("#proteinMarqueeMeasure");
const revealSections = document.querySelectorAll(".section-reveal");

let pointerX = 0;
let pointerY = 0;
let currentX = 0;
let currentY = 0;
let animationFrame;
let marqueeAnimationFrame;
let marqueeCurrent = 0;
let marqueeTarget = 0;

function updatePointer(event) {
  pointerX = event.clientX / window.innerWidth - 0.5;
  pointerY = event.clientY / window.innerHeight - 0.5;
}

function resetPointer() {
  pointerX = 0;
  pointerY = 0;
}

function animate() {
  currentX += (pointerX - currentX) * 0.055;
  currentY += (pointerY - currentY) * 0.055;

  productScene.style.setProperty("--parallax-x", `${currentX * 24}px`);
  productScene.style.setProperty("--parallax-y", `${currentY * 18}px`);
  heroCopy.style.setProperty("--copy-x", `${currentX * -13}px`);
  heroCopy.style.setProperty("--copy-y", `${currentY * -7}px`);
  logo.style.setProperty("--logo-x", `${currentX * -8}px`);

  animationFrame = requestAnimationFrame(animate);
}

function renderProteinMarquee() {
  marqueeCurrent += (marqueeTarget - marqueeCurrent) * 0.12;
  proteinMarqueeText.setAttribute("startOffset", `${marqueeCurrent}px`);

  if (Math.abs(marqueeTarget - marqueeCurrent) > 0.05) {
    marqueeAnimationFrame = requestAnimationFrame(renderProteinMarquee);
  } else {
    marqueeCurrent = marqueeTarget;
    proteinMarqueeText.setAttribute("startOffset", `${marqueeCurrent}px`);
    marqueeAnimationFrame = undefined;
  }
}

function syncProteinMarqueeToScroll() {
  marqueeTarget = window.scrollY * -0.82;
  if (!marqueeAnimationFrame) {
    marqueeAnimationFrame = requestAnimationFrame(renderProteinMarquee);
  }
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (revealSections.length) {
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            sectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealSections.forEach((section) => sectionObserver.observe(section));
  } else {
    revealSections.forEach((section) => section.classList.add("is-visible"));
  }
}

if (!reduceMotion.matches) {
  hero.addEventListener("pointermove", updatePointer);
  hero.addEventListener("pointerleave", resetPointer);
  window.addEventListener("scroll", syncProteinMarqueeToScroll, { passive: true });
  animate();
  syncProteinMarqueeToScroll();
}

reduceMotion.addEventListener("change", (event) => {
  if (event.matches) {
    cancelAnimationFrame(animationFrame);
    cancelAnimationFrame(marqueeAnimationFrame);
    window.removeEventListener("scroll", syncProteinMarqueeToScroll);
    resetPointer();
  } else {
    window.addEventListener("scroll", syncProteinMarqueeToScroll, { passive: true });
    animate();
    syncProteinMarqueeToScroll();
  }
});
