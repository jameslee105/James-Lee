(function setupScoresPage() {
  let checkReady = setInterval(() => {
    const waveform = document.getElementById("waveform");
    const trackList = document.getElementById("trackList");
    const playBtn = document.getElementById("playPauseBtn");

    if (waveform && trackList && playBtn) {
      clearInterval(checkReady);
      initializePlayer(waveform, trackList, playBtn);
    }
  }, 50);

  let autoplaySongId = null;
  const urlParams = new URLSearchParams(window.__SONG_ID__ || window.location.search);
  const songId = urlParams.get('song');
  if (songId) {
    autoplaySongId = parseInt(songId, 10) - 1;
  }

  function initializePlayer(waveform, trackList, playBtn) {
    if (window.wavesurfer) {
      window.wavesurfer.destroy();
    }
    
    trackList.innerHTML = "";

    const tracks = [
      { title: "Above the Sky", src: "music/Above the Sky.mp3", duration: "5:08" },
      { title: "Travel to Wonderland", src: "music/Travel to Wonderland.mp3", duration: "2:23" },
      { title: "King's Land", src: "music/King's Land.mp3", duration: "4:41" },
      { title: "Life of Tree", src: "music/Life of Tree.mp3", duration: "3:22" },
      { title: "Mori", src: "music/mori.mp3", duration: "3:06" },
      { title: "Skyland", src: "music/Skyland.mp3", duration: "3:24" },
      { title: "Coming Back to the Glory", src: "music/Coming back to the glory.mp3", duration: "4:10" },
      { title: "Falling into Water", src: "music/Falling into Water.mp3", duration: "5:02" },
      { title: "Impossible Mission", src: "music/Impossible Mission.mp3", duration: "2:26" },
      { title: "Opening 1", src: "music/Opening 1.mp3", duration: "1:32" },
      { title: "The Final", src: "music/The final.mp3", duration: "3:20" },
      { title: "The Survivor", src: "music/The Survivor.mp3", duration: "2:56" },
      { title: "To the New Island", src: "music/To the new island.mp3", duration: "2:24" }
    ];

    const trackTitle = document.getElementById("track-title");
    const currentTime = document.getElementById("currentTime");
    const totalTime = document.getElementById("totalTime");

    function formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    function loadTrack(index, shouldAutoplay = true) {
      if (window.wavesurfer) {
        window.wavesurfer.destroy();
      }  
      const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#c0c0c0',
        progressColor: '#111',
        cursorColor: '#5ba8ff',
        url: tracks[index].src,
        barWidth: 2,
        barRadius: 3,
        height: 100,
        responsive: true
      });

      window.wavesurfer = wavesurfer;
      trackTitle.innerText = tracks[index].title;
      playBtn.classList.remove("pause");

      wavesurfer.on('ready', () => {
        totalTime.innerText = formatTime(wavesurfer.getDuration());
        if (shouldAutoplay) {
          wavesurfer.play();
          playBtn.classList.add("pause");
        }
      });

      wavesurfer.on('audioprocess', () => {
        currentTime.innerText = formatTime(wavesurfer.getCurrentTime());
      });

      wavesurfer.on('seek', () => {
        currentTime.innerText = formatTime(wavesurfer.getCurrentTime());
      });
    }

    tracks.forEach((track, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${track.title}</span><span class="duration">${track.duration}</span>`;
      li.addEventListener("click", () => loadTrack(index));
      trackList.appendChild(li);
    });

    if (autoplaySongId !== null && tracks[autoplaySongId]) {
      loadTrack(autoplaySongId);
    }

    playBtn.onclick = () => {
      if (window.wavesurfer.isPlaying()) {
        window.wavesurfer.pause();
        playBtn.classList.remove("pause");
      } else {
        window.wavesurfer.play();
        playBtn.classList.add("pause");
      }
    };
  }
})();
