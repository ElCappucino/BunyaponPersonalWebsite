// Fades the page's main content out before following a link to another page
// on the site — the topbar and the coffee cup stay put, only .page-content
// (the <main>) fades. The other half of the crossfade is pure CSS (see
// .page-content in style.css). Kept in its own file because every page loads
// it, including the ones that don't load script.js.
(function () {
  var content = document.querySelector(".page-content");
  if (!content) return;

  var FADE_MS = 250; // keep in sync with .page-content.is-leaving's animation-duration in style.css
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", function (e) {
    // Leave modified clicks (new tab/window, right/middle click) alone, and
    // skip anything a page's own script already handled — index.html's
    // "Games" link swaps views in place rather than navigating.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    var link = e.target.closest("a");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) {
      return; // placeholder links, same-page anchors, and things that were
              // never a page navigation
    }

    if (link.origin !== window.location.origin || link.href === window.location.href) {
      return; // an outside site, or this page linking to itself
    }

    e.preventDefault();
    if (reduceMotion) {
      window.location.href = link.href; // no animation to wait out
      return;
    }
    content.classList.add("is-leaving");
    window.setTimeout(function () {
      window.location.href = link.href;
    }, FADE_MS);
  });
})();
