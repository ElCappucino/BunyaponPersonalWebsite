// ============================================================
// BLOG POSTS — this is the only file you edit to write or add a
// post. Everything else (layout, styling, the page itself) is
// handled by post.html and blog.js and doesn't need touching.
//
// TO ADD A POST: copy one whole block below (from "{" to "},"),
// paste it above this list's closing "];", and edit the text.
// Newest post goes first — this order is the order the cards
// appear in on blog.html.
//
//   slug       the short name used in the page's address, e.g.
//              slug: "derrick" opens at post.html?post=derrick
//              (lowercase, no spaces — use dashes)
//   title      the big heading at the top of the post
//   date       the small line under the title. Any text you like
//              ("August 2025", "12 Sep 2025"). Leave it as ""
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
//   https://youtu.be/xxxx   a YouTube address on its own line turns
//                           into an embedded player
//   [A caption](https://youtu.be/xxxx)
//                           the same, with a caption under it
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
    slug: "flappy-party",
    title: "What I would do if I had to make Flappy Party again",
    date: "May 2024",
    cover: "Assets/Blogs/FlappyParty/flappy_0.webp",
    highlights: [
      "Why skipping version control on my first university project still costs me today.",
      "What I would change about the character customization and event system if I built it again."
    ],
    imageBase: "Assets/Blogs/FlappyParty/",
    body: `
## What is Flappy Party?

Flappy Party is a 2–4 player local party game. Players take control of a bird and make their way across the map toward the finish line. Every tile they land on triggers a pop-up event that they have to perform in real life.

![](flappy_0.webp)

Flappy Party was the first one-term project I made after I started university. Back then I only knew my way around the Unity interface, and most of the code I wrote was a mix of tutorials I found online and code I assumed should be structured that way.

## Version Control Problem

The biggest mistake I made was not using version control. My team and I didn't really know how to set up Git/GitHub or Plastic SCM, so we just passed the Unity package around between us. Some versions of the project ended up lost, and I had no way to get them back.

![](flappy_2.webp)

That still causes problems today, because there are parts of the code I would like to revisit and reuse, and now I simply can't.

After finishing this project, I went and learned version control properly, and I have used it on every project since — so this isn't a problem I run into anymore, thanks to GitHub.

## Character Customization: What I could do better

Players can change their appearance using preset colors before the match starts.

The approach I took was to make the preset textures outside of Unity in an image editor (Photoshop, in this case). I built a list of materials from all the textures in a single script, then set each character's material using a dictionary.

![](flappy_1.webp)
![](flappy_color_1.gif)

It worked fine and the results looked good, but the workflow could be better. Because the textures were made entirely outside Unity, any time one needed fixing or I wanted to change a color, I had to go back to Photoshop and reimport it. From a developer’s perspective, it would be much better to change the color inside the engine editor, so nothing needs reimporting.

The solution I found is to use Unity’s Shader Graph to separate the parts that need different colors, then use a “replace color” node to expose the color as an attribute that can be edited in the editor.

[reference system by Geeze](https://www.youtube.com/watch?v=XW2qW1sDj_A)

If I still wanted color presets, I could store the color values in the controller script and reference them from the character selection menu.

This helps a lot with the development pipeline, because artists can adjust the colors inside the engine and the interface stays simple.

## Event System and Scriptable Objects: What I could do better

The event system in this game lets players add their own custom events. The game also ships with a set of default events, defined across multiple ScriptableObjects.

![](flappy_5.webp)

During development I didn’t understand ScriptableObjects well, so I tried to create a new one every time a custom event was added — which doesn’t really make sense, because they aren’t meant to be created at runtime.

If I had the chance to start over, I would store the event data in a .csv table and write a converter that turns it into a list of event data. That would keep the data organized, and designers wouldn’t have to dig through multiple ScriptableObjects. It would mean reimporting the table whenever something needs fixing, but that happens rarely enough that it wouldn’t become a nuisance.

For the save system, I would use plain JSON, saving the data with the event data type defined earlier.

![](flappy_3.webp)
![Example of how to make a .csv converter](flappy_4.webp)

## Conclusion

To be honest, I’m not really proud of this project, and I wasn’t happy with the outcome when I finished it. But looking back, it is the project that showed me how much I can get through when I struggle with something. It is a reminder that I can work through problems, and that doing so is part of how I became the developer I am now.
`
  },
  {
    slug: "procedural-terrarium",
    title: "Procedural Generation for Terrarium Environment In Unreal Engine 5",
    date: "July 2026",
    cover: "Assets/Blogs/ProceduralTerrarium/ProTer_BlogCard.webp",
    highlights: [
      "Study the procedural generation pipeline in Unreal Engine 5.",
      "Learn how to make a tool for artists to improve scene composite and props arrangement speed in editor."
    ],
    imageBase: "Assets/Blogs/ProceduralTerrarium/",
    body: `
## Introduction

This is the project that I am working on during my internship program at Tokyo University of Technology. The purpose of the study is to learn about the procedural generation pipeline in Unreal Engine 5 and improve artist scene composite and props arrangement time in editor.

In this article, I will explain how I created this tool and what I learn from this project.

## Technical Details

**Unreal Engine 5.6.1 (Blueprint & C++)**

- **Editor Utility Widget** (for creating tools interface)
- **Generated Dynamic Mesh Component** (for procedural mesh generation in editor)
- **Unreal Engine PCG Pipeline** (for procedural placement)

**Blender 5.0**

- For modeling some parts of the environment (Ex. Leaves, Pebbles, Moss’s leaf)

## Procedural Mesh Generation VS Procedural Terrain

In Unreal Engine, the procedural mesh and procedural terrain use different tools to create.

- For procedural mesh, It should use Unreal Engine’s Dynamic Mesh Component.
- For procedural terrain, It should use Unreal Engine’s PCG Pipeline.

Because of that, I need to distinguish the components in the terrarium to suit each tool.

For containers, rocks and foliages, I use procedural mesh because the part that needs to procedurally create is the shape.

For mosses and pebbles, I use procedural terrain because it needs the procedural placement.

## Editor Utility Widget (EUW) : Key to create a modifying tool and utility button.

Before going into the procedural generation detail, I want to introduce the feature that I use to create a tool with a better user interface and create more features other than modify parameters. It is called “Editor Utility Widget”.

Editor Utility Widget is a tool based on Unreal Engine’s UMG (Unreal Motion Graphics). It is a tool that can be used to create a custom user interface in Unreal Engine’s editor. You can set up a button with a function that works like a shortcut Ex. a button to create a preset object in the scene.

![](ProTer_EUW_1.webp)

It helps me a lot in this project because my tool is meant to be helpful to artists that want to compose the scene but don't want to get involved with unrelated parameters inside the Unreal Engine.

## Addition Custom C++ Tools For EUW : On Selection Editor Changed

Editor Utility Widget has some limitations. One of them is that the user interface doesn’t update when the user selects an object in the editor scene. This can be a nuisance because the user needs to click an update button every time they want to update the data.

Luckily, there is a tutorial on how to make a custom node using c++.

[https://qiita.com/Rinderon/items/4eb84cd88f8e4bc019bc](https://qiita.com/Rinderon/items/4eb84cd88f8e4bc019bc)

There is some adjustment because the tutorial article is for UE4. But after all the debugging, it works fine now and it is a huge upgrade to my tools.

## Components : Rocks

I use box as a primitive shape, add a loop cut using subdivision, and create rough texture using perlin noise.

![](ProTer_rock_1.webp)
![](ProTer_rock_2.webp)

The surface doesn’t look natural enough, so I added a plane cut to create a natural cut surface.

![](ProTer_rock_3.webp)
![](ProTer_rock_gif1.webp)

The result

![](ProTer_rock_4.webp)
![](ProTer_rock_gif2.webp)

## Components : Foliage (Fern)

I create a stem along the spline and use the position along the spline for mesh placement.

![](ProTer_fern_gif1.webp)

I also optimize the leaf placement by using Unreal Engine’s Hierarchical Instanced Static Mesh (HISM). It is a way to copy instances of a single mesh on GPU and create multiple objects from a transform data.

![](ProTer_fern_1.webp)

I also make a shortcut to create a new fern object in the same clump.

![](ProTer_fern_2.webp)
![](ProTer_fern_gif2.webp)

## Components : Mosses and Pebbles

For the components that need to create multiple objects in the specific area like mosses and pebbles, I use Unreal Engine’s PCG Pipeline. The object that I use doesn’t need procedural mesh generation, so I model it in Blender separately and use PCG to randomly generate inside the area.

![](ProTer_preset_3.webp)
![](ProTer_area_gif1.webp)
![](ProTer_area_gif2.webp)

## Components : Container

For the container, I originally wanted to make it procedural too but it causes a problem when I want to place a PCG volume that needs raycast on the static mesh surface but the procedural mesh is a dynamic mesh. In the end, I model it in blender and just make the shortcut button in EUW to create it as a preset.

![](ProTer_preset_4.webp)

## Results and Timelapse

- Most of the features are working properly. It took around 30-60 minutes to create a simple terrarium.
- Some of the components still have a performance issue (Ex. Frame lag when moving objects which rebuild itself during adjustments).
- Tools still have some user experience issues (Ex. Some of the features should have a one-click solution).
- Overall, I achieved all the objectives and made me understand a lot more about Unreal Engine 5 and the procedural generation pipeline.

![](ProTer_preset_2.webp)

[https://youtu.be/_eXzn-kUcYo](https://youtu.be/_eXzn-kUcYo)
`
  },
  {
    slug: "derrick",
    title: "Process of Making: Derrick",
    date: "August 2025",
    cover: "Assets/Screens/Derrick_Image1.webp",
    highlights: [
      "Process of implementing the aerial control of player and enemy entity.",
      "Problems that i approach about sound system."
    ],
    imageBase: "Assets/Blogs/Derrick/",
    body: `
This project was developed during a university game jam. I teamed up with a group of friends I had never worked with before, so the experience felt fresh and exciting.

![](team-derrick.webp)

There was no specific theme. The only limitation was the one-month development period before the semester began. Since we didn't have a strong concept at the start, we decided to create a simple roguelike arcade-style aerial shooter. The player controls a plane, dodges bullets, and shoots enemies while managing aerial movement.

![Huge inspiration from Wind Runners](derrick-inspiration.webp)

## Movement

I implemented a movement system that simulates how a plane naturally turns left and right. Although the game is a 2D side-scroller, I wanted the aircraft to feel dynamic and responsive. The plane gradually tilts toward its target rotation instead of snapping instantly.

The movement process:

1. Update velocity based on the current facing direction.
2. Smoothly adjust the facing direction toward player input using SmoothDamp.
3. Update the visual roll based on the current rotation.

![](derrick_code1.webp)

The "update visual roll" step is important because it makes the plane movement feel smoother and more similar to modern aerial combat games.

![](plane2_exampleClip.webp)

## Enemy

To make enemy movement and chasing behavior feel smooth, I designed a state-based system that allows enemies to switch behaviors depending on the situation.

*This code was written before I learned about formal finite state machines, so the states were handled manually inside a straightforward update loop.*

![](derrick-enemy.webp)

- Chasing State: The enemy tracks the player's position, rotates toward them, and shoots with a cooldown.

![](derrick-enemy-chase.webp)

- Fleeing State: The enemy moves away from the player and returns to the chasing state after a set duration.

![](derrick-enemy-flee.webp)

Other enemy types, such as ground enemies and the boss, use similar behavior but without the fleeing state.

## Enemy Wave

Enemy waves are structured in two layers: main waves and sub waves. Sub waves repeatedly spawn groups of enemies at fixed intervals. Each main wave contains multiple sub waves. Once all sub waves in a main wave are completed, the player receives an upgrade.

I used Scriptable Objects to store wave data, making it easier for designers to configure and balance enemy patterns.

![](derrick-enemy-wave.webp)

![](derrick-enemy-wave2.webp)

## Problems

In this project, I experimented with FMOD for environmental sound because I wanted to learn something new.

However, it was more complex than expected and required a significant amount of time to implement properly.

Later, I realized that Unity's built-in Audio Source with spatial blend settings could achieve a similar 2D surround effect much more simply. In hindsight, using FMOD for this case was somewhat over-engineered.

![](derrick-sound.webp)

That said, if I need more advanced features such as sound mixing or detailed audio control in future projects, I would consider using FMOD again.

## What I Learned

As the only programmer on the team, I was responsible for developing every gameplay feature in this project. This gave me a valuable opportunity to learn all aspects of game development. From implementing core mechanics to solving more complex challenges without relying on tutorials, such as creating the smooth plane's movement system and building a flexible enemy wave data configurator for designer.

Besides the technical side, this project taught me how crucial communication and scoping are in a small period of time. With a short development timeline, minor miscommunication could cause significant setbacks. I also gained experience working with the art team and teach them how to export the assets properly for unity.
`
  }
];
