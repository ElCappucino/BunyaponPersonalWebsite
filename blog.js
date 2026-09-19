// Fills post.html in with one of the posts from posts.js.
//
// Nothing here needs editing to write a post — posts.js is the file for that.
// Which post shows is decided by the address:
//   post.html?post=derrick   -> the post whose slug is "derrick"
//   post.html                -> the first post in posts.js
// The fallback matters because opening post.html straight from the folder has
// no ?post= on the end.
(function () {
  var titleEl = document.getElementById("postTitle");
  var dateEl = document.getElementById("postDate");
  var coverEl = document.getElementById("postCover");
  var bodyEl = document.getElementById("postBody");
  if (!titleEl || !bodyEl) return;

  // An image on a line of its own: ![optional caption](file.webp). Declared up
  // here, not with the converter below, because the rendering runs first and
  // would otherwise reach for it while it's still empty.
  var IMAGE_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

  var posts = typeof POSTS === "undefined" ? [] : POSTS;
  var slug = getParam("post");
  var post = null;

  for (var i = 0; i < posts.length; i++) {
    if (!slug || posts[i].slug === slug) {
      post = posts[i];
      break;
    }
  }

  if (!post) {
    // A link to a post that isn't in posts.js — say so, instead of leaving a
    // blank page behind.
    document.title = "Post not found – Bunyapon Chaiongkarn";
    titleEl.textContent = "Post not found";
    if (dateEl) dateEl.remove();
    if (coverEl) coverEl.remove();
    bodyEl.innerHTML = '<p>There is no post called "' + escapeHtml(slug) +
      '" yet. <a href="index.html">Back to the games</a>.</p>';
    return;
  }

  document.title = post.title + " – Bunyapon Chaiongkarn";
  titleEl.textContent = post.title;

  if (dateEl) {
    if (post.date) {
      dateEl.textContent = post.date;
    } else {
      dateEl.remove(); // an empty date would otherwise leave a gap
    }
  }

  if (coverEl) {
    if (post.cover) {
      coverEl.src = post.cover;
      coverEl.alt = post.title;
    } else {
      coverEl.remove();
    }
  }

  bodyEl.innerHTML = toHtml(post.body, post.imageBase);

  // ==========================================================
  // The plain-text -> HTML converter: a deliberately small subset of
  // Markdown, only what a devlog needs (posts.js lists it all). No library
  // to load, and anything it doesn't recognise stays ordinary text rather
  // than disappearing.
  // ==========================================================

  function toHtml(text, imageBase) {
    // A blank line separates one block from the next; within a
    // block, line breaks are just wrapping and get joined back up.
    var blocks = String(text || "").trim().split(/\n[ \t]*\n/);
    var html = [];

    blocks.forEach(function (block) {
      var lines = block.split("\n").map(trim).filter(notEmpty);
      if (lines.length) html.push(blockToHtml(lines, imageBase));
    });

    return html.join("\n");
  }

  function blockToHtml(lines, imageBase) {
    var first = lines[0];

    // ## Heading  /  ### Sub-heading
    var heading = first.match(/^(#{2,4})\s+(.*)$/);
    if (heading) {
      var level = heading[1].length; // ## -> h2, ### -> h3, #### -> h4
      return "<h" + level + ">" + inline(heading[2]) + "</h" + level + ">";
    }

    // One or more images, each on its own line
    if (IMAGE_LINE.test(first)) {
      return lines.map(function (line) {
        var parts = line.match(IMAGE_LINE);
        return parts ? figure(parts[1], parts[2], imageBase) : paragraph(line);
      }).join("\n");
    }

    // - bulleted list (one item per line)
    if (/^-\s+/.test(first)) return listToHtml("ul", lines, /^-\s+/);

    // 1. numbered list (one item per line)
    if (/^\d+\.\s+/.test(first)) return listToHtml("ol", lines, /^\d+\.\s+/);

    return paragraph(lines.join(" "));
  }

  function listToHtml(tag, lines, marker) {
    var items = lines.map(function (line) {
      return "<li>" + inline(line.replace(marker, "")) + "</li>";
    });
    return "<" + tag + ">" + items.join("") + "</" + tag + ">";
  }

  function paragraph(text) {
    return "<p>" + inline(text) + "</p>";
  }

  function figure(caption, src, imageBase) {
    // loading="lazy": a single post can carry ten screenshots and a gif, so
    // the ones further down are only fetched as the reader reaches them.
    var html = '<figure class="post-figure"><img src="' +
      escapeHtml(resolveImage(src, imageBase)) + '" alt="' +
      escapeHtml(caption) + '" loading="lazy">';
    if (caption) html += "<figcaption>" + inline(caption) + "</figcaption>";
    return html + "</figure>";
  }

  // Image names in a post body are written bare ("team.png") and looked for
  // in that post's own imageBase folder. Anything that already looks like a
  // path or a web address is left alone.
  function resolveImage(src, imageBase) {
    if (/^(https?:|data:|\/|\.{1,2}\/)/i.test(src)) return src;
    return (imageBase || "") + src;
  }

  // Text formatting inside a line. Escaping happens FIRST, so anything typed
  // in a post is shown as written and can never turn into live HTML by
  // accident; the tags added afterwards are the only ones that survive.
  function inline(text) {
    return escapeHtml(text)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (whole, label, url) {
        var offSite = /^https?:/i.test(url);
        return '<a href="' + url + '"' +
          (offSite ? ' target="_blank" rel="noopener noreferrer"' : "") +
          ">" + label + "</a>";
      })
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  }

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function trim(line) {
    return line.trim();
  }

  function notEmpty(line) {
    return line.length > 0;
  }

  // Read ?post=… straight off the address rather than via URLSearchParams,
  // which isn't always available on a page opened directly from the folder.
  function getParam(name) {
    var match = window.location.search.match(
      new RegExp("[?&]" + name + "=([^&]*)")
    );
    return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "";
  }
})();

// Blog list page (blog.html) — one card per post, in the order posts.js
// lists them, each linking to its own post. Kept separate from the block
// above since the two run on different pages; each does nothing on the
// other's page.
(function () {
  var list = document.getElementById("blogList");
  if (!list) return;

  var posts = typeof POSTS === "undefined" ? [] : POSTS;

  list.innerHTML = posts.length
    ? posts.map(cardHtml).join("\n")
    : "<p>No posts yet — check back soon.</p>";

  function cardHtml(post) {
    var highlights = (post.highlights || [])
      .map(function (line) {
        return "<li>" + escapeHtml(line) + "</li>";
      })
      .join("");

    return (
      '<a class="blog-card" href="post.html?post=' + encodeURIComponent(post.slug) + '">' +
        (post.cover ? '<img class="blog-card-image" src="' + escapeHtml(post.cover) + '" alt="">' : "") +
        '<div class="blog-card-text">' +
          '<h2 class="blog-card-title">' + escapeHtml(post.title) + "</h2>" +
          (highlights ? '<ul class="blog-card-highlights">' + highlights + "</ul>" : "") +
          (post.date ? '<p class="blog-card-date">' + escapeHtml(post.date) + "</p>" : "") +
        "</div>" +
      "</a>"
    );
  }

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
