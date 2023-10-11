/**
 * Render song
 * Scroll top cd
 * Play / Pause / Seek
 * rotate cd
 * random
 * handle when ended
 * scroll into view
 * play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// const PLAYER = "PPT_PLAYLIST";

const player = $(".player");
const heading = $("header h2");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const audio = $("#audio");
const progress = $("#progress");
const playlist = $(".playlist");

const app = {
  songs: [
    {
      name: "Khói Thuốc Đợi Chờ",
      singer: "Phương Phương Thảo",
      path: "./assets/audio/song_1.mp3",
      image: "./assets/img/img_1.jpg",
    },
    {
      name: "Đến Sau",
      singer: "Phương Phương Thảo",
      path: "./assets/audio/song_2.mp3",
      image: "./assets/img/img_2.jpg",
    },
    {
      name: "Chiều Nghe Biển Khóc",
      singer: "Phương Phương Thảo",
      path: "./assets/audio/song_3.mp3",
      image: "./assets/img/img_3.jpg",
    },
    {
      name: "Em, Anh Và Cô Ấy",
      singer: "Phương Phương Thảo",
      path: "./assets/audio/song_4.mp3",
      image: "./assets/img/img_4.jpg",
    },
    {
      name: "Hãy Về Đây Bên Anh",
      singer: "Phương Phương Thảo",
      path: "./assets/audio/song_5.mp3",
      image: "./assets/img/img_5.jpg",
    },
    {
      name: "Hoa Bằng Lăng",
      singer: "Phương Phương Thảo",
      path: "./assets/audio/song_6.mp3",
      image: "./assets/img/img_6.jpg",
    },
    {
      name: "Kiếp Ve Sầu",
      singer: "Phương Phương Thảo",
      path: "./assets/audio/song_7.mp3",
      image: "./assets/img/img_7.jpg",
    },
    {
      name: "Hoa Dại",
      singer: "Phương Phương Thảo",
      path: "./assets/audio/song_8.mp3",
      image: "./assets/img/img_8.jpg",
    },
    {
      name: "Thần Thoại",
      singer: "Phương Phương Thảo, Dương Edward",
      path: "./assets/audio/song_9.mp3",
      image: "./assets/img/img_9.jpg",
    },
    {
      name: "Tình Xưa Nghĩa Cũ 3",
      singer: "Phương Phương Thảo",
      path: "./assets/audio/song_10.mp3",
      image: "./assets/img/img_10.jpg",
    },
  ],
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  currentIndex: 0,
  // config: JSON.parse(PLAYER) || {},
  setConfig(key, value) {
    this.config[key] = value;
  },
  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  render() {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index='${index}'>
          <div class="thumb"
              style="background-image: url('${song.image}')">
          </div>
          <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
          </div>
          <div class="option">
              <i class="fas fa-ellipsis-h"></i>
          </div>
      </div>
      `;
    });
    playlist.innerHTML = htmls.join("");
  },

  handleEvents() {
    const _this = this;

    // Rotate cd
    const cdRotateAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 12000,
        iterations: Infinity,
      }
    );

    cdRotateAnimate.pause();

    // zoom in and out cd when scrolling
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
    };

    // when click play song
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // listen when audio is playing
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdRotateAnimate.play();
    };

    // listen when audio is pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdRotateAnimate.pause();
    };

    // progress update theo tien do bai hat
    audio.ontimeupdate = function () {
      const progressPercent = (audio.currentTime / audio.duration) * 100;

      progress.value = !isNaN(progressPercent) ? progressPercent : 0;
    };

    // seek song
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // next song
    nextBtn.onclick = function () {
      _this.nextOrRandomSong();

      _this.render();
      _this.scrollSongIntoView();
    };

    // prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollSongIntoView();
    };

    // random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;

      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // ended song
    audio.onended = function () {
      if (_this.isRepeat) {
        _this.repeatSong();
      } else {
        _this.nextOrRandomSong();
        _this.render();
      }
    };

    // repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;

      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // click playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        // click song to play
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },

  scrollSongIntoView() {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 200);
  },

  nextSong() {
    this.currentIndex++;

    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  nextOrRandomSong() {
    if (this.isRandom) {
      this.randomSong();
    } else {
      this.nextSong();
    }
    audio.play();
  },

  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  randomSong() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    {
      this.currentIndex = newIndex;
      this.loadCurrentSong();
    }

    // const newSongs = this.songs;
  },

  repeatSong() {
    this.currentIndex = this.currentIndex;
    this.loadCurrentSong();
    audio.play();
  },

  loadCurrentSong() {
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },

  start() {
    this.render();

    this.defineProperties();

    this.handleEvents();
    this.loadCurrentSong();
  },
};

app.start();
