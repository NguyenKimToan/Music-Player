const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "MUSIC_PLAYER";

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

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},
    songs: [
        {
            name: "Ánh sao và bầu trời",
            singer: "TRI",
            path: "musics/AnhSaoVaBauTroi-TRI-7085073.mp3",
            image: "images/anhsaovabautroi.jpg"
        },
        {
            name: "Bật tình yêu lên",
            singer: "Tăng Duy Tân - Hòa Minzy",
            path: "musics/BatTinhYeuLen-TangDuyTanHoaMinzy-8715666.mp3",
            image: "images/battinhyeulen.jpg"
        },
        {
            name: "Bên trên tầng lầu",
            singer: "Tăng Duy Tân",
            path: "musics/BenTrenTangLau-TangDuyTan-7412012.mp3",
            image: "images/bentrentanglau.jpg"
        },
        {
            name: "Chúng ta của hiện tại",
            singer: "Sơn Tùng MTP",
            path: "musics/ChungTaCuaHienTai-SonTungMTP-6892340.mp3",
            image: "images/chungtacuahientai.jpg"
        },
        {
            name: "Cô đơn trên sofa",
            singer: "Trung Quân Idol",
            path: "musics/CoDonTrenSofaLiveCoverAtSoulOfTheForest-TrungQuanIdol-8520175.mp3",
            image: "images/codontrensofa.jpg"
        },
        {
            name: "Cô gái này là của ai",
            singer: "Kri - Rush - Nhi Nhi",
            path: "musics/CoGaiNayLaCuaAi-KrixRushDoanQuocVinhNhiNhi-6926198.mp3",
            image: "images/cogainaylacuaai.jpg"
        },
        {
            name: "Để tôi ôm lấy em bằng giai điệu này",
            singer: "Kai Đinh - Min - GreyD",
            path: "musics/DeToiOmEmBangGiaiDieuNay-KaiDinhMINGREYD-8416034.mp3",
            image: "images/detoiomlayembanggiaidieunay.jpg"
        },
        {
            name: "Lời tạm biệt chưa nói",
            singer: "GreyD - Đoàn Thế Lan - Orange",
            path: "musics/LoiTamBietChuaNoi-GREYDDoanTheLanOrange-7613756.mp3",
            image: "images/loitambietchuanoi.jpg"
        },
        {
            name: "Như anh đã thấy em",
            singer: "Phúc XP",
            path: "musics/NhuAnhDaThayEm-PhucXPFreakD-7370334.mp3",
            image: "images/nhuanhdathayem.jpg"
        },
        {
            name: "Sau lời từ khước",
            singer: "Phan Mạnh Quỳnh",
            path: "musics/SauLoiTuKhuocThemeSongFromMAI-PhanManhQuynh-13780092.mp3",
            image: "images/sauloitukhuoc.jpg"
        },
        {
            name: "Thiên lý ơi",
            singer: "Jack97",
            path: "musics/ThienLyOi-JackJ97-13829746.mp3",
            image: "images/thienlyoi.jpg"
        },
        {
            name: "Từng quen",
            singer: "Wren Evans",
            path: "musics/b76sn4ccpk.mp3",
            image: "images/tungquen.jpg"
        },
        {
            name: "Waiting For You",
            singer: "Mono",
            path: "musics/WaitingForYou-MONOOnionn-7733882.mp3",
            image: "images/waitingforyou.jpg"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                        <div class="song ${index === this.currentIndex ? "active" : ""
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

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };

        // Xử lý khi tua song
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Xử lý bật / tắt random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        // Xử lý lặp lại một song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào song option
                if (e.target.closest(".option")) {
                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
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
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của button repeat & random
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isRepeat);
    }
};

app.start();
