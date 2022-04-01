const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//const PlAYER_STORAGE_KEY = "music-player";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const volume = $("#setVolume");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},
    // (1/2) Uncomment the line below to use localStorage
    // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Avid",
            singer: "SawanoHiroyuki[nZk]:mizuki",
            path: "./music-source/Avid-HiroyukiSawanoMizuki-7035876.mp3",
            image: "./image-source/86.jpg"
        },
        {
            name: "Akuma no ko",
            singer: "Ai Higuchi",
            path: "./music-source/Akuma No Ko - Ai Higuchi.mp3",
            image: "./image-source/aot4-ending2.jpg"
        },
        {
            name: "Shogeki",
            singer: "Yuko Ando",
            path: "./music-source/Shogeki - Yuko Ando.mp3",
            image: "./image-source/aot4-ending1.jpg"
        },
        {
            name: "Unity",
            singer: "LMYK",
            path: "./music-source/Unity - LMYK.mp3",
            image: "./image-source/vanitas.jpg"
        },
        {
            name: "KoiNo Uta",
            singer: "Akari Kito",
            path: "./music-source/KoiNoUta-AkariKito-6720280.mp3",
            image: "./image-source/kawaii.jpg"
        },
        {
            name: "Like Flames",
            singer: "MindaRyn",
            path: "./music-source/Like Flames - MindaRyn.mp3",
            image: "./image-source/slime1.jpg"
        },
        {
            name: "Sincerely",
            singer: "TRUE",
            path: "./music-source/Sincerely - TRUE.mp3",
            image: "./image-source/violet.jpg"
        },
        {
            name: "Storyteller",
            singer: "TRUE",
            path: "./music-source/Storyteller - TRUE.mp3",
            image: "./image-source/slime2.jpg"
        },
        {
            name: "Cry Baby",
            singer: "OfficialHigeDandism",
            path: "./music-source/CryBaby-OfficialHigeDandism.mp3",
            image: "./image-source/tokyo.jpg"
        },
        {
            name: "Yoru ni kakeru",
            singer: "YOASOBI",
            path: "./music-source/Yoru ni kakeru - YOASOBI.mp3",
            image: "./image-source/racing-into-the-night.jpg"
          },
      ],
      setConfig: function (key, value) {
          this.config[key] = value;
          // (2/2) Uncomment the line below to use localStorage
          // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
      },
      render: function () {
          const htmls = this.songs.map((song, index) => {
              return `
                  <div class="song ${
                      index === this.currentIndex ? "active" : ""
                  }" data-index="${index}">
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
      defineProperties: function () {
          Object.defineProperty(this, "currentSong", {
              get: function () {
                  return this.songs[this.currentIndex];
              }
          });
      },
      handleEvents: function () {
          const _this = this;
          const cdWidth = cd.offsetWidth;

          // Handle CD spins / stops
          const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
              duration: 10000, // 10 seconds
              iterations: Infinity
          });
          cdThumbAnimate.pause();

          // Handles CD enlargement / reduction
          document.onscroll = function () {
              const scrollTop = window.scrollY || document.documentElement.scrollTop;
              const newCdWidth = cdWidth - scrollTop;

              cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
              cd.style.opacity = newCdWidth / cdWidth;
          };

          // Handle when click play
          playBtn.onclick = function () {
              if (_this.isPlaying) {
                  audio.pause();
              }
              else {
                  audio.play();
              }
          };

          // When the song is played
          audio.onplay = function() {
              _this.isPlaying = true;
              player.classList.add("playing");
              cdThumbAnimate.play();
          };

          // When the song is paused
          audio.onpause = function () {
              _this.isPlaying = false;
              player.classList.remove("playing");
              cdThumbAnimate.pause();
          };

          // When the song progress changes
          audio.ontimeupdate = function () {
              if (audio.duration) {
                  const progressPercent = (audio.currentTime / audio.duration) * 100;
                  progress.value = progressPercent;
              }
          };

          // Handling when seek
          progress.onchange = function(e) {
              const seekTime = (audio.duration / 100) * e.target.value;
              audio.currentTime = seekTime;
          };
          //change volume
          volume.onchange = function(e) {
              const newVol = e.target.value / 100;
              audio.volume = newVol;
          };
          // When next song
          nextBtn.onclick = function () {
              if (_this.isRandom) {
                  _this.playRandomSong();
              } 
              else {
                  _this.nextSong();
              }
              audio.play();
              _this.render();
              _this.scrollToActiveSong();
          };

          // When prev song
          prevBtn.onclick = function () {
              if (_this.isRandom) {
                  _this.playRandomSong();
              }
              else {
                  _this.prevSong();
              }
              audio.play();
              _this.render();
              _this.scrollToActiveSong();
          };

          // Xử lý bật / tắt random song
          // Handling on / off random song
          randomBtn.onclick = function(e) {
              _this.isRandom = !_this.isRandom;
              //_this.setConfig("isRandom", _this.isRandom);
              randomBtn.classList.toggle("active", _this.isRandom);
          };

          // Xử lý lặp lại một song
          // Single-parallel repeat processing
          repeatBtn.onclick = function(e) {
              _this.isRepeat = !_this.isRepeat;
              //_this.setConfig("isRepeat", _this.isRepeat);
              repeatBtn.classList.toggle("active", _this.isRepeat);
          };

          // Xử lý next song khi audio ended
          // Handle next song when audio ended
          audio.onended = function () {
              if (_this.isRepeat) {
                  audio.play();
              }
              else {
                  nextBtn.click();
              }
          };

          // Lắng nghe hành vi click vào playlist
          // Listen to playlist clicks
          playlist.onclick = function(e) {
              const songNode = e.target.closest(".song:not(.active)");
              if (songNode || e.target.closest(".option")) {
              // Xử lý khi click vào song
              // Handle when clicking on the song
                  if (songNode) {
                      _this.currentIndex = Number(songNode.dataset.index);
                      _this.loadCurrentSong();
                      _this.render();
                      audio.play();
                  }
                  // Xử lý khi click vào song option
                  // Handle when clicking on the song option
                  if (e.target.closest(".option")) {}
              }
          };
      },
      scrollToActiveSong: function () {
          setTimeout(() => {
              $(".song.active").scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                  inline: "nearest"
              });
          }, 300);
      },
      loadCurrentSong: function () {
          heading.textContent = this.currentSong.name;
          cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
          audio.src = this.currentSong.path;
      },
      loadConfig: function () {
          //this.isRandom = this.config.isRandom;
          //this.isRepeat = this.config.isRepeat;
      },
      nextSong: function () {
          this.currentIndex++;
          if (this.currentIndex >= this.songs.length) {
              this.currentIndex = 0;
          }
          this.loadCurrentSong();
      },
      prevSong: function () {
          this.currentIndex--;
          if (this.currentIndex < 0) {
              this.currentIndex = this.songs.length - 1;
          }
          this.loadCurrentSong();
      },
      playRandomSong: function () {
          let newIndex;
          do {
              newIndex = Math.floor(Math.random() * this.songs.length);
          } 
          while (newIndex === this.currentIndex);

          this.currentIndex = newIndex;
          this.loadCurrentSong();
      },
      start: function () {
      // Gán cấu hình từ config vào ứng dụng
      // Assign configuration from config to application
      this.loadConfig();

      // Định nghĩa các thuộc tính cho object
      // Defines properties for the object
      this.defineProperties();

      // Lắng nghe / xử lý các sự kiện (DOM events)
      // Listening / handling events (DOM events)
      this.handleEvents();

      // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
      // Load the first song information into the UI when running the app
      this.loadCurrentSong();

      // Render playlist
      this.render();

      // Hiển thị trạng thái ban đầu của button repeat & random
      // Display the initial state of the repeat & random button
      //randomBtn.classList.toggle("active", this.isRandom);
      //repeatBtn.classList.toggle("active", this.isRepeat);
    }
};
app.start();
