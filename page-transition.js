
(() => {
  if (window.__birthdayTransitionsLoaded) return;
  window.__birthdayTransitionsLoaded = true;

  const style = document.createElement("style");

  style.textContent = `
    #pageTransition {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      background:
        radial-gradient(circle at center, rgba(255, 105, 180, .2), transparent 45%),
        linear-gradient(135deg, #170b24, #5c1648, #160b24);
      opacity: 0;
      pointer-events: none;
      transition: opacity 550ms ease;
    }

    #pageTransition.active {
      opacity: 1;
    }

    #pageTransition span {
      color: #ff9acb;
      font-size: clamp(55px, 10vw, 100px);
      text-shadow: 0 0 25px #ff1493, 0 0 55px #ff69b4;
      animation: heartBeat 700ms infinite alternate;
    }

    @keyframes heartBeat {
      to { transform: scale(1.2); }
    }

    @media (prefers-reduced-motion: reduce) {
      #pageTransition,
      #pageTransition span {
        animation: none;
        transition: none;
      }
    }
  `;

  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "pageTransition";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = "<span>♥</span>";
  document.body.appendChild(overlay);

  let navigating = false;

  function isHtmlPage(url) {
    return /\.html?$/i.test(url.pathname);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");

    if (!link || event.defaultPrevented) return;

    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      link.target === "_blank" ||
      link.hasAttribute("download")
    ) {
      return;
    }

    const url = new URL(link.href, window.location.href);

    if (url.origin !== window.location.origin) return;
    if (!isHtmlPage(url)) return;

    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return;
    }

    if (navigating) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    navigating = true;
    overlay.classList.add("active");

    window.setTimeout(() => {
      window.location.href = url.href;
    }, 550);
  });
})();
