// Fills post.html in with one of the posts from posts.js.
//
// Nothing in here needs editing to write a post — posts.js is the
// file for that. This is the machinery: it works out which post the
// address bar is asking for, then turns that post's plain-text body
// into real HTML (headings, paragraphs, lists, images, captions).
//
// Which post shows is decided by the address:
//   post.html?post=derrick   -> the post whose slug is "derrick"
//   post.html                -> the first post in posts.js
// The no-name fallback matters because opening post.html straight
// from the folder (double-clicking it) has no ?post= on the end.
(function () {
  var titleEl = document.getElementById("postTitle");
  var dateEl = document.getElementById("postDate");
  var coverEl = document.getElementById("postCover");
  var bodyEl = document.getElementById("postBody");
  if (!titleEl || !bodyEl) return;

  // An image on a line of its own: ![optional caption](file.png)
  // Declared up here, not down with the converter it belongs to,
  // because the rendering below runs before that point in the file
  // and would otherwise reach for it while it's still empty.
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
    // A link pointing at a post that isn't in posts.js (a typo in the
    // slug, or a post that was renamed) — say so plainly instead of
    // leaving a blank page behind.
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
  // The plain-text -> HTML converter.
  //
  // This is a deliberately small subset of Markdown — only the
  // handful of things a devlog actually needs (posts.js lists them
  // all). Keeping it small is the point: there's no library to
  // load, nothing to install, and the rules are short enough to
  // hold in your head. Anything it doesn't recognise is treated as
  // ordinary text rather than silently disappearing.
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
    // loading="lazy" so the images further down the post are only
    // fetched as the reader scrolls to them — worth having here,
    // where a single post can carry ten screenshots and a gif.
    var html = '<figure class="post-figure"><img src="' +
      escapeHtml(resolveImage(src, imageBase)) + '" alt="' +
      escapeHtml(caption) + '" loading="lazy">';
    if (caption) html += "<figcaption>" + inline(caption) + "</figcaption>";
    return html + "</figure>";
  }

  // Image names in a post's body are written bare ("team.png") and
  // looked for in that post's own imageBase folder. Anything that
  // already looks like a real path or a web address is left alone,
  // so a one-off image from somewhere else still works.
  function resolveImage(src, imageBase) {
    if (/^(https?:|data:|\/|\.{1,2}\/)/i.test(src)) return src;
    return (imageBase || "") + src;
  }

  // Text formatting that can appear in the middle of a line. The
  // escaping happens first, so anything typed in a post is shown as
  // written and can never turn into live HTML by accident; the tags
  // added afterwards are the only ones that survive.
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

  // Reading ?post=… straight off the address instead of via
  // URLSearchParams, because that isn't available when a page is
  // opened directly from the folder in some older browsers.
  function getParam(name) {
    var match = window.location.search.match(
      new RegExp("[?&]" + name + "=([^&]*)")
    );
    return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "";
  }
})();
