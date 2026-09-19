// Grid <-> detail view switching.
//
// Only one of #gridView / #detailView is ever actually in the layout —
// the other carries the `hidden` attribute (real display: none) — so each
// view can size and align itself independently instead of the two
// fighting over a shared box (the grid stays pinned under the navbar; the
// detail panel centers on the remaining viewport height, like the
// case-stack does). Switching panels is a fade on #gamesStage itself:
// fade out, swap which panel is hidden, fade back in. The CD-sliding
// animation on the left is driven the same way and in parallel: .is-open
// on #caseStack just slides .ps-cd from tucked-under-the-case to
// peeking-out; the motion itself lives in the CSS transition, not here.
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
  //   learnMoreUrl where the "Learn More" button links to — a
  //                page on this site (e.g. "derrick.html") once
  //                one exists, or an outside link for now
  //   cdImage      this game's disc art (from Assets/CD/), shown
  //                once its case is clicked
  //   screens      the 3 gameplay screenshots on the right, in
  //                the order they should appear
  //
  // Leave a value as "#" for a link that doesn't go anywhere yet
  // — same as the placeholder text below, safe to click, just
  // doesn't lead anywhere until a real link replaces it.
  //
  // Each block's key ("yao-ying-yan", "derrick", ...) is the
  // same data-game id its card carries in index.html — that's
  // what connects a click on a card to the right block here. The
  // grid thumbnail image itself (what a card looks like before
  // it's clicked) is set on that card in index.html, not here.
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
      cdImage: "../Assets/CD/CD_YaoYingYan.png",
      screens: ["../Assets/Screens/YYY_Image1.png", "../Assets/Screens/YYY_Image2.png", "../Assets/Screens/YYY_Image3.png"]
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
      cdImage: "../Assets/CD/CD_Derrick.png",
      screens: ["../Assets/Screens/Derrick_Image1.png", "../Assets/Screens/Derrick_Image2.png", "../Assets/Screens/Derrick_Image3.png"]
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
      cdImage: "../Assets/CD/CD_FlappyParty.png",
      screens: ["../Assets/Screens/flappy_Image1.png", "../Assets/Screens/flappy_Image2.png", "../Assets/Screens/flappy_Image3.png"]
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
      cdImage: "../Assets/CD/CD_KhlongSan.png",
      screens: ["../Assets/Screens/KhlongSan_Image1.png", "../Assets/Screens/KhlongSan_Image2.png", "../Assets/Screens/KhlongSan_Image3.png"]
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
      cdImage: "../Assets/CD/CD_Seaside.png",
      screens: ["../Assets/Screens/Seaside_Image1.png", "../Assets/Screens/Seaside_Image2.png", "../Assets/Screens/Seaside_Image3.png"]
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
      cdImage: "../Assets/CD/CD_SIL3.png",
      screens: ["../Assets/Screens/SIL3_Image1.png", "../Assets/Screens/SIL3_Image2.png", "../Assets/Screens/SIL3_Image3.png"]
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
      cdImage: "../Assets/CD/CD_SummerBreak.png",
      screens: ["../Assets/Screens/SummerBreak_Image1.png", "../Assets/Screens/SummerBreak_Image2.png", "../Assets/Screens/SummerBreak_Image3.png"]
    }
  };

  var stage = document.getElementById("gamesStage");
  var caseStack = document.getElementById("caseStack");
  var gridView = document.getElementById("gridView");
  var detailView = document.getElementById("detailView");
  var backLink = document.getElementById("navGames");
  var caseBackLink = document.getElementById("navBack"); // "Back to select
    // page", above the case — shown only in detail view, purely via CSS
    // (.case-stack.is-open .case-back-link in style.css) staying in sync
    // with the .is-open class toggled below

  if (!stage || !caseStack || !gridView || !detailView) return;

  // Elements inside #detailView that populateDetail() below fills in from
  // a GAMES entry. The meta <dd>s are matched by their own data-field
  // (see index.html) rather than by position, so reordering the meta list
  // there someday can't silently scramble which value lands where.
  var detailTitle = detailView.querySelector(".detail-title");
  var detailDate = detailView.querySelector(".detail-date");
  var detailDesc = detailView.querySelector(".detail-desc");
  var detailMetaFields = detailView.querySelectorAll("[data-field]");
  var detailItchLink = detailView.querySelector('.icon-link[aria-label="itch.io"]');
  var detailYoutubeLink = detailView.querySelector('.icon-link[aria-label="YouTube"]');
  var detailLearnMoreLink = detailView.querySelector(".btn-learn-more");
  var detailScreenImgs = detailView.querySelectorAll(".detail-screens img");
  var caseCdImg = caseStack.querySelector(".ps-cd"); // the floating disc
    // prop — not inside #detailView, so it isn't covered by the
    // detailView-scoped querySelectors above

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
      restartCdSpin(caseCdImg); // so the new disc always starts its slow
        // spin (see style.css's cd-spin) from the same angle, rather than
        // picking up wherever the last game's rotation happened to be —
        // safe to do here since the CD is still off-screen at this point
        // (see the comment on populateDetail's caller), same as the src
        // swap just above it
    }
  }

  // A CSS animation keeps running (and keeps its own clock) for as long as
  // an element matches the rule that applies it — style.css's cd-spin
  // rule applies unconditionally, so on its own it would never restart,
  // just keep looping from whenever the page first loaded. Briefly
  // removing the animation, forcing the browser to notice (offsetHeight —
  // reading layout forces it to apply the style change immediately
  // instead of batching it), then handing the animation back is the
  // standard way to make a CSS animation start over from its first frame.
  function restartCdSpin(el) {
    el.style.animation = "none";
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight;
    el.style.animation = "";
  }

  var FADE_MS = 250; // keep in sync with .games-stage's transition-duration in style.css

  function crossFadeTo(showDetail, game) {
    if (stage.classList.contains("is-fading")) return; // already mid-transition
    stage.classList.add("is-fading");

    window.setTimeout(function () {
      if (showDetail) {
        populateDetail(game); // swap the content in while opacity: 0, so
                               // the change itself is never visible
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
      // Force layout before removing is-fading, so the fade-back-in
      // actually transitions instead of the browser coalescing both
      // opacity changes into one frame.
      // eslint-disable-next-line no-unused-expressions
      stage.offsetHeight;
      stage.classList.remove("is-fading");
    }, FADE_MS);
  }

  // Each card's data-game (set in index.html) looks up its info in GAMES
  // above; populateDetail() fills #detailView with it as part of the fade.
  document.querySelectorAll(".game-card").forEach(function (card) {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      crossFadeTo(true, GAMES[card.dataset.game]);
    });
  });

  // "Games" in the nav, and "Back to select page" above the case in detail
  // view, both do the same thing: back to the grid, instead of reloading
  // index.html.
  [backLink, caseBackLink].forEach(function (link) {
    if (!link) return;
    link.addEventListener("click", function (e) {
      e.preventDefault();
      crossFadeTo(false);
    });
  });
})();
