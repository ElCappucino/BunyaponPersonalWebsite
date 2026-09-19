// Grid <-> detail view switching.
//
// Only one of #gridView / #detailView is in the layout at a time (the other
// carries `hidden`), so each view sizes and aligns itself independently.
// Switching is a fade on #gamesStage: fade out, swap which panel is hidden,
// fade back in. The CD slide happens in parallel — .is-open on #caseStack is
// all this file does; the motion itself is a CSS transition.
(function () {
  // ==========================================================
  // GAME DETAILS — edit this section to change what shows on a
  // game's detail page (the view that opens when its card is
  // clicked). One block per game, every field a plain bit of
  // text between quotes — find the game, edit the text, keep
  // the quotes and commas, save. Nothing else in this file needs
  // to change.
  //
  //   title        the big heading
  //   date         the line under it (any text — a full date, a
  //                month, a year, whatever reads best)
  //   desc         the paragraph under that
  //   mainRole     "Main Role :" value
  //   teamSize     "Team Size :" value
  //   timePeriod   "Time Period :" value
  //   tools        "Tools :" value
  //   itchUrl      where the itch.io icon links to
  //   youtubeUrl   where the YouTube icon links to
  //   learnMoreUrl where the "Learn More" button links to — a devlog on
  //                this site ("post.html?post=derrick"), or an
  //                outside link
  //   cdImage      this game's disc art (from Assets/CD/), shown
  //                once its case is clicked
  //   screens      the 3 gameplay screenshots on the right, in
  //                the order they should appear
  //
  // Leave a value as "#" for a link that doesn't go anywhere yet.
  //
  // Each block's key ("yao-ying-yan", "derrick", ...) is the same
  // data-game id its card carries in index.html — that's what
  // connects a click on a card to the right block here. The grid
  // thumbnail itself is set on the card in index.html, not here.
  // ==========================================================
  var GAMES = {
    "yao-ying-yan": {
      title: "Yao Ying Yan",
      date: "October 2025",
      desc: "An arcade shooter game that player draw symbols on a Post-it and use it as a talisman to fight ghosts.",
      mainRole: "Programmer",
      teamSize: "15 People",
      timePeriod: "1 Week (Game Jam)",
      tools: "Unity Engine",
      itchUrl: "https://punpunxd.itch.io/yao-ying-yan",
      youtubeUrl: "https://www.youtube.com/watch?v=rUVgmxndLlk&t=74s",
      learnMoreUrl: "#",
      cdImage: "Assets/CD/CD_YaoYingYan.webp",
      screens: ["Assets/Screens/YYY_Image1.webp", "Assets/Screens/YYY_Image2.webp", "Assets/Screens/YYY_Image3.webp"]
    },

    "derrick": {
      title: "Derrick",
      date: "August 2025",
      desc: "A side-scrolling aerial combat action roguelike game where you take control of an aircraft, fight enemies, and upgrade your way to survival. Defeat various enemies, face massive war machines, and improve your score.",
      mainRole: "Programmer",
      teamSize: "6 People",
      timePeriod: "1 Month",
      tools: "Unity Engine",
      itchUrl: "https://elcappu.itch.io/derrick",
      youtubeUrl: "https://www.youtube.com/watch?v=CUNxuDVp4Oc&t=1s",
      learnMoreUrl: "post.html?post=derrick",
      cdImage: "Assets/CD/CD_Derrick.webp",
      screens: ["Assets/Screens/Derrick_Image1.webp", "Assets/Screens/Derrick_Image2.webp", "Assets/Screens/Derrick_Image3.webp"]
    },

    "flappy": {
      title: "Flappy Party",
      date: "May 2024",
      desc: "A 2-4 players local party game. The player will play as a bird and walk through the map until you reach the finish line. In every tile, There will be a pop-up event that you need to perform in real life.",
      mainRole: "Programmer, Game Designer, Producer",
      teamSize: "4 People",
      timePeriod: "3 Month",
      tools: "Unity Engine",
      itchUrl: "https://elcappu.itch.io/flappy-party",
      youtubeUrl: "https://www.youtube.com/watch?v=WEsmn-cPZVU&source_ve_path=MjM4NTE&embeds_referring_euri=https%3A%2F%2Felcappu.itch.io%2F",
      learnMoreUrl: "#",
      cdImage: "Assets/CD/CD_FlappyParty.webp",
      screens: ["Assets/Screens/flappy_Image1.webp", "Assets/Screens/flappy_Image2.webp", "Assets/Screens/flappy_Image3.webp"]
    },

    "khlong-san": {
      title: "Khlong San Sam Phob",
      date: "February 2025",
      desc: "A side scroller game where player will play as a Dim Sum delivery person and learn about past, present, and future of Khlong San area in Thailand.",
      mainRole: "Programmer",
      teamSize: "5 People",
      timePeriod: "1 Month",
      tools: "Unity Engine",
      itchUrl: "https://elcappu.itch.io/khlongsansamphob",
      youtubeUrl: "https://www.youtube.com/watch?v=0X1CXEE7mw8",
      learnMoreUrl: "#",
      cdImage: "Assets/CD/CD_KhlongSan.webp",
      screens: ["Assets/Screens/KhlongSan_Image1.webp", "Assets/Screens/KhlongSan_Image2.webp", "Assets/Screens/KhlongSan_Image3.webp"]
    },

    "seaside": {
      title: "Seaside Showdown",
      date: "June 2025",
      desc: "A fast-paced top-down, 2D fighter party game where you can choose three abilities of your choice to create your own combo. Fight and knock other players off the battlefield, be the last one standing to win!",
      mainRole: "Programmer, Producer",
      teamSize: "7 People",
      timePeriod: "6 Months",
      tools: "Custom Engine created using OpenGL3 + SDL2",
      itchUrl: "https://elcappu.itch.io/seaside-showdown",
      youtubeUrl: "https://www.youtube.com/watch?v=bORGj4YTt6M&t=2s",
      learnMoreUrl: "#",
      cdImage: "Assets/CD/CD_Seaside.webp",
      screens: ["Assets/Screens/Seaside_Image1.webp", "Assets/Screens/Seaside_Image2.webp", "Assets/Screens/Seaside_Image3.webp"]
    },

    "sil-3": {
      title: "Shameless Itim Lord 3",
      date: "April 2026",
      desc: "An arcade game about making Thai-style Popsicle. Player needs to serve popsicle to the customers and maintain the heatstroke level",
      mainRole: "Programmer, Game Designer",
      teamSize: "4 People",
      timePeriod: "1 Week (Game Jam)",
      tools: "Unity Engine",
      itchUrl: "https://elcappu.itch.io/shameless-itim-lord-3",
      youtubeUrl: "https://www.youtube.com/watch?v=IhUYTDjYu3k&t=2s",
      learnMoreUrl: "#",
      cdImage: "Assets/CD/CD_SIL3.webp",
      screens: ["Assets/Screens/SIL3_Image1.webp", "Assets/Screens/SIL3_Image2.webp", "Assets/Screens/SIL3_Image3.webp"]
    },

    "summer-break": {
      title: "Summer Break",
      date: "October 2025",
      desc: "A drama, heart-warming, 2D side scroller adventure game about Koji, who lost his girlfriend and wants to go to the summer festival and bring his memory back. ",
      mainRole: "Programmer",
      teamSize: "8 People",
      timePeriod: "3 Months",
      tools: "Unity Engine",
      itchUrl: "https://nmmn4947.itch.io/summer-festival",
      youtubeUrl: "https://www.youtube.com/watch?v=LgLR6r5RzNk",
      learnMoreUrl: "#",
      cdImage: "Assets/CD/CD_SummerBreak.webp",
      screens: ["Assets/Screens/SummerBreak_Image1.webp", "Assets/Screens/SummerBreak_Image2.webp", "Assets/Screens/SummerBreak_Image3.webp"]
    }
  };

  var stage = document.getElementById("gamesStage");
  var caseStack = document.getElementById("caseStack");
  var gridView = document.getElementById("gridView");
  var detailView = document.getElementById("detailView");
  var backLink = document.getElementById("navGames");
  var caseBackLink = document.getElementById("navBack"); // shown only in
    // detail view, via .is-open in style.css

  if (!stage || !caseStack || !gridView || !detailView) return;

  // Elements populateDetail() fills in from a GAMES entry. The meta <dd>s are
  // matched by their own data-field rather than by position, so reordering
  // the list in index.html can't scramble which value lands where.
  var detailTitle = detailView.querySelector(".detail-title");
  var detailDate = detailView.querySelector(".detail-date");
  var detailDesc = detailView.querySelector(".detail-desc");
  var detailMetaFields = detailView.querySelectorAll("[data-field]");
  var detailItchLink = detailView.querySelector('.icon-link[aria-label="itch.io"]');
  var detailYoutubeLink = detailView.querySelector('.icon-link[aria-label="YouTube"]');
  var detailLearnMoreLink = detailView.querySelector(".btn-learn-more");
  var detailScreenImgs = detailView.querySelectorAll(".detail-screens img");
  var caseCdImg = caseStack.querySelector(".ps-cd"); // outside #detailView,
    // so not covered by the queries above

  function populateDetail(game) {
    if (!game) return;
    detailTitle.textContent = game.title;
    detailDate.textContent = game.date;
    detailDesc.textContent = game.desc;
    detailMetaFields.forEach(function (field) {
      field.textContent = game[field.dataset.field];
    });
    if (detailItchLink) detailItchLink.href = game.itchUrl;
    if (detailYoutubeLink) detailYoutubeLink.href = game.youtubeUrl;
    if (detailLearnMoreLink) detailLearnMoreLink.href = game.learnMoreUrl;
    detailScreenImgs.forEach(function (img, i) {
      img.src = game.screens[i];
      img.alt = game.title + " gameplay screenshot " + (i + 1);
    });
    if (caseCdImg && game.cdImage) {
      caseCdImg.src = game.cdImage;
      restartCdSpin(caseCdImg); // so each disc starts its spin from the same
        // angle instead of picking up the last one's rotation
    }
  }

  // Removing the animation, forcing the browser to notice (reading
  // offsetHeight applies the change immediately rather than batching it),
  // then handing it back is the standard way to restart a CSS animation
  // from its first frame.
  function restartCdSpin(el) {
    el.style.animation = "none";
    el.offsetHeight; // forces layout — deliberate, not a stray statement
    el.style.animation = "";
  }

  // Kicks off the network requests for a game's detail images as early as
  // possible — on hover (below) and, as a fallback for whichever comes
  // first, at click time (in crossFadeTo()) — instead of waiting for
  // populateDetail() to set them on the real <img> elements after the
  // fade-out finishes. These Image() objects are never attached to the page
  // — they exist only to warm the browser's cache, so that by the time
  // populateDetail() points the visible <img>s at the same URLs, the bytes
  // are already there and the swap paints on the next frame instead of
  // showing a half-loaded image.
  //
  // preloadedGames dedupes so hovering a card twice, or hovering then
  // clicking, only fires the requests once per game.
  var preloadedGames = new Set();
  function preloadGameImages(game) {
    if (!game || preloadedGames.has(game)) return;
    preloadedGames.add(game);
    game.screens.forEach(function (src) {
      new Image().src = src;
    });
    if (game.cdImage) {
      new Image().src = game.cdImage;
    }
  }

  var FADE_MS = 250; // keep in sync with .games-stage's transition-duration in style.css

  function crossFadeTo(showDetail, game) {
    if (stage.classList.contains("is-fading")) return; // already mid-transition
    stage.classList.add("is-fading");

    if (showDetail) {
      preloadGameImages(game); // start now, in parallel with the fade-out
        // below, rather than only after FADE_MS — see preloadGameImages().
    }

    window.setTimeout(function () {
      if (showDetail) {
        populateDetail(game); // swapped in at opacity 0, so it's never seen
        gridView.hidden = true;
        gridView.setAttribute("inert", "");
        detailView.hidden = false;
        detailView.removeAttribute("inert");
        stage.classList.add("is-detail");
        caseStack.classList.add("is-open");
      } else {
        detailView.hidden = true;
        detailView.setAttribute("inert", "");
        gridView.hidden = false;
        gridView.removeAttribute("inert");
        stage.classList.remove("is-detail");
        caseStack.classList.remove("is-open");
      }
      // Force layout before removing is-fading, so the fade back in actually
      // transitions instead of both opacity changes being coalesced into one
      // frame.
      stage.offsetHeight;
      stage.classList.remove("is-fading");
    }, FADE_MS);
  }

  // Each card's data-game (set in index.html) looks up its info in GAMES.
  document.querySelectorAll(".game-card").forEach(function (card) {
    var game = GAMES[card.dataset.game];

    card.addEventListener("click", function (e) {
      e.preventDefault();
      crossFadeTo(true, game);
    });

    // Warms this game's images the moment the pointer enters its card, so a
    // deliberate hover-then-click has a real head start beyond the click-time
    // preload in crossFadeTo() — by the time the click lands, a hover of even
    // a few hundred ms may already have the images most or all of the way
    // downloaded. Mouse/trackpad only (there's no hover on touch), but touch
    // still gets the click-time preload as a fallback, same as before.
    card.addEventListener("mouseenter", function () {
      preloadGameImages(game);
    });
  });

  // "Games" in the nav and "Back to select page" both return to the grid in
  // place, instead of reloading index.html.
  [backLink, caseBackLink].forEach(function (link) {
    if (!link) return;
    link.addEventListener("click", function (e) {
      e.preventDefault();
      crossFadeTo(false);
    });
  });
})();
