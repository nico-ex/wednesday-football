/* =========================================================
   WEDNESDAY FOOTBALL — minimal vanilla JS
   Two small things only:
   1. Hide the sticky mobile button once the calendar is on screen.
   2. "Copy iCal link" button for desktop Outlook users.
   The site works perfectly fine without this file.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. Sticky CTA ---------- */
  var cta = document.getElementById("stickyCta");
  var calendar = document.getElementById("calendar");
  var footer = document.querySelector(".footer");

  if (cta && calendar && "IntersectionObserver" in window) {
    // Track which "end of page" sections are on screen. While any of them is
    // visible the floating button is redundant, so it gets out of the way.
    var visible = Object.create(null);

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible[entry.target.id || "footer"] = entry.isIntersecting;
        });
        var anyVisible = Object.keys(visible).some(function (k) {
          return visible[k];
        });
        cta.classList.toggle("is-hidden", anyVisible);
      },
      { rootMargin: "0px 0px -35% 0px" }
    );

    observer.observe(calendar);
    if (footer) observer.observe(footer);
  }

  /* ---------- 2. Open the holiday dates when linked to from the hero ---------- */
  function revealTarget() {
    if (window.location.hash !== "#no-football") return;
    var panel = document.getElementById("no-football");
    if (!panel) return;
    panel.open = true;
    panel.classList.add("is-flash");
    window.setTimeout(function () {
      panel.classList.remove("is-flash");
    }, 1600);
  }
  window.addEventListener("hashchange", revealTarget);
  revealTarget();

  /* ---------- 3. Copy iCal link ---------- */
  var copyBtn = document.getElementById("copy-ical");
  var copyLabel = document.getElementById("copy-ical-label");
  var copyStatus = document.getElementById("copy-status");

  if (copyBtn && copyLabel) {
    copyBtn.addEventListener("click", function () {
      var url = copyBtn.getAttribute("data-ical") || "";

      var done = function (ok) {
        var message = ok ? "Copied!" : "Press ⌘/Ctrl+C";
        copyLabel.textContent = message;
        if (copyStatus) {
          copyStatus.textContent = ok
            ? "iCal link copied to clipboard"
            : "Could not copy automatically";
        }
        window.setTimeout(function () {
          copyLabel.textContent = "Copy iCal link";
          if (copyStatus) copyStatus.textContent = "";
        }, 2200);
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(
          function () { done(true); },
          function () { fallback(url, done); }
        );
      } else {
        fallback(url, done);
      }
    });
  }

  function fallback(text, done) {
    try {
      var field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.position = "absolute";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(field);
      done(ok);
    } catch (err) {
      done(false);
    }
  }
})();
