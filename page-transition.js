
(() => {
  if (window.__birthdayTransitionsLoaded) return;
  window.__birthdayTransitionsLoaded = true;

  const style = document.createElement("style");
  style.textContent = `
    #pageTransition {
      position: fixed;
      inset: 0;
      z-index: 999999;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, #170b24, #5c1648, #160b24);
      opacity: 0;
      pointer-events: none;
      transition: opacity 550ms ease;
    }

    #pageTransition.active {
      opacity: 1;
    }

    #pageTransition span {
      color: #ff9acb;
      font-size: 90px;
      text-shadow: 0 0 25px #ff1493;
      animation: heartBeat 700ms infinite alternate;
    }

    @keyframes heartBeat {
      to { transform: scale(1.2); }
    }
  `;

  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "pageTransition";
  overlay.innerHTML = "<span>♥</span>";
  document.body.appendChild(overlay);

  let navigating = false;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented) return;
    if (event.button !== 0 || event.ctrlKey || event.metaKey ||
        event.shiftKey || event.altKey || link.target === "_blank" ||
        link.hasAttribute("download")) return;

    const url = new URL(link.href, location.href);

    if (url.origin !== location.origin) return;
    if (!/\.html?$/i.test(url.pathname)) return;

    event.preventDefault();
    if (navigating) return;
    navigating = true;
    overlay.classList.add("active");

    setTimeout(() => {
      location.href = url.href;
    }, 550);
  });
})();
