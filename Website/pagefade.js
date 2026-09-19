// Fades the page's main content out before following a link to another
// page on the site — the topbar (brand + nav) and the coffee-decor stay
// put, only .page-content (the <main>) fades. The other half of the
// crossfade lives entirely in CSS (see style.css's .page-content /
// page-fade-in, which runs on every load with no JS needed at all).
// Kept in its own file rather than folded into script.js because it
// applies to every page, including ones — like about.html — that don't
// load script.js at all.
(function () {
  var content = document.querySelector(".page-content");
  if (!content) return;

  var FADE_MS = 250; // keep in sync with .page-content.is-leaving's animation-duration in style.css
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("click", function (e) {
    // Leave modified clicks (new-tab/new-window shortcuts, right/middle
    // click) alone, and skip anything a page's own script already
    // handled itself — e.g. index.html's "Games" nav link and "Back to
    // select page", which swap views in place via script.js instead of
    // ever actually navigating.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    var link = e.target.closest("a");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    var href = link.getAttribute("href");
    if (!href || href.charAt(0) === "#" || href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) {
      return; // placeholder links ("#"), same-page anchors, and links
               // that were never a page navigation to begin with
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
