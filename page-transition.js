
(() => {
  if (window.__birthdayTransitionsLoaded) return;
  window.__birthdayTransitionsLoaded = true;

  const style = document.createElement("style");
  style.textContent = `
    #globalPageTransition {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      pointer-events: none;
      opacity: 0;
      background:
        radial-gradient(circle at center, rgba(255,105,180,.25), transparent 45%),
        linear-gradient(135deg, #160b24, #4b1238, #100b20);
      display: grid;
      place-items: center;
      transition: opacity .55s ease;
    }

    #globalPageTransition.active {
      opacity: 1;
    }

    #globalPageTransition .transition-heart {
      color: #ff8fc7;
      font-size: clamp(48px, 10vw, 100px);
      text-shadow: 0 0 25px #ff69b4, 0 0 60px #ff1493;
      animation: birthdayHeartPulse .8s ease-in-out infinite alternate;
    }

    @keyframes birthdayHeartPulse {
      from { transform: scale(.8); }
      to { transform: scale(1.18); }
    }

    @media (prefers-reduced-motion: reduce) {
      #globalPageTransition,
      #globalPageTransition .transition-heart {
        transition: none;
        animation: none;
      }
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "globalPageTransition";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = '<div class="transition-heart">♥</div>';
  document.body.appendChild(overlay);

  let transitioning = false;

  function playTransition(destination) {
    if (transitioning) return;
    transitioning = true;
    overlay.classList.add("active");

    window.setTimeout(() => {
      window.location.href = destination;
    }, 550);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey ||
        event.shiftKey || event.altKey || link.target === "_blank" ||
        link.hasAttribute("download")) return;

    const destination = new URL(link.href, window.location.href);

    if (destination.origin !== window.location.origin) return;
    if (destination.pathname === window.location.pathname &&
        destination.search === window.location.search &&
        destination.hash) return;

    if (!/\.(html?)$/i.test(destination.pathname)) return;

    event.preventDefault();
    playTransition(destination.href);
  });

  // Fallback for navigation started directly by JavaScript.
  window.addEventListener("beforeunload", () => {
    overlay.classList.add("active");
  });
})();
