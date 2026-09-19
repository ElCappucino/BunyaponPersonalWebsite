// ============================================================
// BLOG POSTS — this is the only file you edit to write or add a
// post. Everything else (layout, styling, the page itself) is
// handled by post.html and blog.js and doesn't need touching.
//
// TO ADD A POST: copy one whole block below (from "{" to "},"),
// paste it above this list's closing "];", and edit the text.
// Newest post goes first — the order here is the order they'll
// appear once the blog index page exists.
//
//   slug       the short name used in the page's address, e.g.
//              slug: "derrick" opens at post.html?post=derrick
//              (lowercase, no spaces — use dashes)
//   title      the big heading at the top of the post
//   date       the small line under the title. Any text you like
//              ("September 2026", "12 Sep 2026"). Leave it as ""
//              to hide the line completely.
//   cover      the big image under the title, or "" for none
//   highlights 1-3 short bullet points shown on this post's card on
//              the blog list page — not shown on the post itself.
//              Keep each one to a single line; that's the card, not
//              the place to summarise the whole post.
//   imageBase  the folder your post's images live in. Every image
//              in the body below is looked for in here, so you
//              write just the file name instead of the full path.
//   body       the post itself — see the writing guide below.
//
// ------------------------------------------------------------
// WRITING THE BODY
//
// The body sits between two backticks (`) and is written as plain
// text, close to the .md files you already write:
//
//   Leave a BLANK LINE between paragraphs.
//   ## Heading              starts a section heading
//   ### Smaller heading     a sub-heading under that
//   - item                  a bulleted list (one "- " per line)
//   1. item                 a numbered list (one per line)
//   ![](picture.png)        an image, on its own line
//   ![A caption](pic.png)   an image with a caption under it
//   *slanted*               italic text
//   **heavy**               bold text
//   [link text](https://…)  a link
//
// Anything else is treated as ordinary text, so apostrophes,
// quotes, underscores and brackets are all safe to type normally.
//
// TWO CHARACTERS TO AVOID inside the body, because JavaScript
// gives them a special meaning and they'd break the page:
//   a backtick  `     — it would end the body early
//   a dollar sign immediately followed by a curly brace
// Regular dollar signs on their own ("$20") are fine.
// ============================================================
var POSTS = [
  {
    slug: "derrick",
    title: "Process of Making: Derrick",
    date: "August 2025",
    cover: "../Assets/Screens/Derrick_Image1.png",
    highlights: [
      "Process of implementing the aerial control of player and enemy entity.",
      "Problems that i approach about sound system."
    ],
    imageBase: "../Assets/Blogs/Derrick/",
    body: `
This project was developed during a university game jam. I teamed up with a group of friends I had never worked with before, so the experience felt fresh and exciting.

![](team-derrick.png)

There was no specific theme. The only limitation was the one-month development period before the semester began. Since we didn't have a strong concept at the start, we decided to create a simple roguelike arcade-style aerial shooter. The player controls a plane, dodges bullets, and shoots enemies while managing aerial movement.

![Huge inspiration from Wind Runners](derrick-inspiration.png)

## Movement

I implemented a movement system that simulates how a plane naturally turns left and right. Although the game is a 2D side-scroller, I wanted the aircraft to feel dynamic and responsive. The plane gradually tilts toward its target rotation instead of snapping instantly.

The movement process:

1. Update velocity based on the current facing direction.
2. Smoothly adjust the facing direction toward player input using SmoothDamp.
3. Update the visual roll based on the current rotation.

![](derrick_code1.png)

The "update visual roll" step is important because it makes the plane movement feel smoother and more similar to modern aerial combat games.

![](plane2_exampleClip.gif)

## Enemy

To make enemy movement and chasing behavior feel smooth, I designed a state-based system that allows enemies to switch behaviors depending on the situation.

*This code was written before I learned about formal finite state machines, so the states were handled manually inside a straightforward update loop.*

![](derrick-enemy.png)

- Chasing State: The enemy tracks the player's position, rotates toward them, and shoots with a cooldown.

![](derrick-enemy-chase.png)

- Fleeing State: The enemy moves away from the player and returns to the chasing state after a set duration.

![](derrick-enemy-flee.png)

Other enemy types, such as ground enemies and the boss, use similar behavior but without the fleeing state.

## Enemy Wave

Enemy waves are structured in two layers: main waves and sub waves. Sub waves repeatedly spawn groups of enemies at fixed intervals. Each main wave contains multiple sub waves. Once all sub waves in a main wave are completed, the player receives an upgrade.

I used Scriptable Objects to store wave data, making it easier for designers to configure and balance enemy patterns.

![](derrick-enemy-wave.png)

![](derrick-enemy-wave2.png)

## Problems

In this project, I experimented with FMOD for environmental sound because I wanted to learn something new.

However, it was more complex than expected and required a significant amount of time to implement properly.

Later, I realized that Unity's built-in Audio Source with spatial blend settings could achieve a similar 2D surround effect much more simply. In hindsight, using FMOD for this case was somewhat over-engineered.

![](derrick-sound.png)

That said, if I need more advanced features such as sound mixing or detailed audio control in future projects, I would consider using FMOD again.

## What I Learned

As the only programmer on the team, I was responsible for developing every gameplay feature in this project. This gave me a valuable opportunity to learn all aspects of game development. From implementing core mechanics to solving more complex challenges without relying on tutorials, such as creating the smooth plane's movement system and building a flexible enemy wave data configurator for designer.

Besides the technical side, this project taught me how crucial communication and scoping are in a small period of time. With a short development timeline, minor miscommunication could cause significant setbacks. I also gained experience working with the art team and teach them how to export the assets properly for unity.
`
  }
];
