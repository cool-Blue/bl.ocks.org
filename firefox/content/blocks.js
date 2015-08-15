window.addEventListener("load", function load() {
  window.removeEventListener("load", load, false);
  gBrowser.addEventListener("DOMContentLoaded", function(e) {
    var document = e.originalTarget;
    if (document.location.hostname !== "gist.github.com") return;
    var observer = new MutationObserver(redraw);

    observer.observe(document.documentElement, {childList: true, subtree: true});

    redraw();

    function redraw() {
      var container = document.querySelector(".gist-sidebar") || document.querySelector(".repository-sidebar");
      if (!container) return;

      var parts = document.location.pathname.substring(1).split("/"),
          user = parts[0],
          id = parts[1],
          sha = parts[2];
      if (!user || !/^[a-z0-9][a-z0-9\-_]*$/i.test(user)) return;
      if (!/^([0-9]+|[0-9a-f]{20})$/.test(id)) id = null;
      if (!/^[0-9a-f]{40}$/.test(sha)) sha = null;

      var anchor = container.querySelector(".bl-ocks-button"),
          href = "http://bl.ocks.org/" + user + (id ? "/" + id + (sha ? "/" + sha : "") : "");

      if (!anchor) {
        anchor = document.createElement("a");
        anchor.className = "btn btn-block sidebar-button bl-ocks-button";
        anchor.style.margin = "15px 0";
        anchor.style.color = "steelblue";
        anchor.innerHTML = '<span class="octicon octicon-link-external"></span><span> bl.ocks.org</span>';
      }

      // Disconnect to avoid observing our own mutations.
      if (anchor.href !== href || anchor.parentNode !== container) {
        observer.disconnect();
        anchor.href = href;
        container.appendChild(anchor);
        observer.observe(document.documentElement, {childList: true, subtree: true});
      }
    }
  }, false);
}, false);
