(function () {
  "use strict";

  /** @type {{ src: string; label: string }[]} */
  var TRACKS = [
    { src: "media/99Luftballons.mp4", label: "99Luftballons.mp4" },
    { src: "media/SLAUGHTERHOUSE.mp4", label: "SLAUGHTERHOUSE.mp4" },
    { src: "media/bunnysuit.mp4", label: "bunnysuit.mp4" },
    { src: "media/TCC.mp4", label: "TCC.mp4" },
    { src: "media/sobitter.mp4", label: "sobitter.mp4" },
  ];

  var DISPLAY_NAME = "H4rvey";

  var idx = Math.floor(Math.random() * TRACKS.length);

  var video = document.getElementById("bgVideo");
  var playPauseBtn = document.getElementById("playPauseBtn");
  var nextBtn = document.getElementById("nextBtn");
  var bootLine = document.getElementById("bootLine");
  var displayName = document.getElementById("displayName");

  var discordBtn = document.getElementById("discordBtn");
  var discordBackdrop = document.getElementById("discordBackdrop");
  var discordPanel = document.getElementById("discordPanel");
  var discordClose = document.getElementById("discordClose");

  displayName.textContent = DISPLAY_NAME;

  function setUiPlaying(playing) {
    playPauseBtn.classList.toggle("ctrl--playing", playing);
    playPauseBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
  }

  function tryUnmuteAndPlay() {
    video.muted = true;
    var p = video.play();
    if (p && typeof p.then === "function") {
      p.then(function () {
        video.muted = false;
      }).catch(function () {
        setUiPlaying(false);
      });
    } else {
      video.muted = false;
    }
    setTimeout(function () {
      try {
        video.muted = false;
      } catch (e) {}
    }, 120);
  }

  function loadIndex(i) {
    idx = (i + TRACKS.length) % TRACKS.length;
    var t = TRACKS[idx];
    video.loop = true;
    video.pause();
    video.src = t.src;
    bootLine.textContent = "> stream::local file=" + t.label;

    var booted = false;
    function kick() {
      if (booted) return;
      booted = true;
      tryUnmuteAndPlay();
    }
    video.addEventListener("loadeddata", kick, { once: true });
    video.load();
    if (video.readyState >= 2) {
      kick();
    }
  }

  video.addEventListener("play", function () {
    setUiPlaying(true);
  });
  video.addEventListener("pause", function () {
    setUiPlaying(false);
  });
  video.addEventListener("ended", function () {
    setUiPlaying(false);
  });

  playPauseBtn.addEventListener("click", function () {
    if (video.paused) {
      video.muted = false;
      video.play().catch(function () {});
    } else {
      video.pause();
    }
  });

  nextBtn.addEventListener("click", function () {
    loadIndex(idx + 1);
  });

  function openDiscord() {
    discordBackdrop.hidden = false;
    discordPanel.hidden = false;
  }

  function closeDiscord() {
    discordPanel.hidden = true;
    discordBackdrop.hidden = true;
  }

  discordBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    openDiscord();
  });
  discordClose.addEventListener("click", closeDiscord);
  discordBackdrop.addEventListener("click", closeDiscord);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !discordPanel.hidden) closeDiscord();
  });

  loadIndex(idx);
})();
