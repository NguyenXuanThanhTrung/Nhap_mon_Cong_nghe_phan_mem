/*Xử lí chức năng cho màn hình chính*/
class Display {

    /*Tạo màn hình trò chơi*/
    constructor() {
        this.display = "mainScreen";
        this.container = document.querySelector("#container");
        this.header = document.querySelector(".messages h2");
        this.paragraph = document.querySelector(".messages p");
        this.messages = {
            mainScreen: ["Tetris", "Mời bạn chọn cấp độ!!!"],
            paused: ["Tạm dừng", "Tiếp tục chơi chứ?"],
            continuing: ["Tiếp tục", "Tiếp tục chơi chứ?"],
            gameOver: ["Bạnthua", "Mời điền tên của bạn"],
            highScores: ["Điểm cao", ""],
            help: ["Hướngdẫn", "Điều khiển trò chơi"]
        };
    }


    /*Nhận màn hình trò chơi*/
    get() {
        return this.display;
    }

    /*Hiển thị trò chơi trên màn hình*/
    set(display) {
        this.display = display;
        return this;
    }


    /*Hiển thị thông báo*/
    show() {
        this.container.className = this.display;
        this.header.innerHTML = this.messages[this.display][0];
        this.paragraph.innerHTML = this.messages[this.display][1];
    }

    /*Ẩn thông báo*/
    hide() {
        this.container.className = "playing";
    }


    /*Trả về true nếu hiển thị ở màn hình chính*/
    inMainScreen() {
        return this.display === "mainScreen";
    }

    /*Trả về true nếu màn hình đang ở chế độ chơi game*/
    isPlaying() {
        return this.display === "playing";
    }

    /*chuyển thành true nếu màn hình ở chế độ tạm dừng*/
    isPaused() {
        return this.display === "paused";
    }
}
/*Xử lí cấp độ*/
class Level {

    constructor(maxLevels) {
        this.levelerElem = document.querySelector(".leveler");
        this.maxLevels = maxLevels;
        this.level = 1;
        this.score = 0;
    }

    /*Lấy ra cấp độ ban đầu*/
    get() {
        return this.level;
        this.intervalId = setInterval(() => {
            this.update();
        }, 500);
    }

    /*tăng cấp độ*/
    inc() {
        Utils.unselect();
        if (this.level < this.maxLevels) {
            this.level += 1;
            this.show();
        }
    }

    /*Giảm cấp độ*/
    dec() {
        Utils.unselect();
        if (this.level > 1) {
            this.level -= 1;
            this.show();
        }
    }

    /*Điều chỉnh cấp độ*/
    choose(level) {
        if (level > 0 && level <= this.maxInitialLevel) {
            this.level = level;
            this.show();
        }
    }


    /*Hiển thị cấp độ được chọn*/
    show() {
        this.levelerElem.innerHTML = this.level;
    }
}
/*Xử lí sự kiện bàn phím*/
class Keyboard {

    constructor(display, scores, shortcuts) {
        this.fastKeys = [70, 70, 70, 70, 70, 70];
        this.shortcuts = shortcuts;
        this.keyPressed = null;
        this.count = 0;

        this.display = display;
        this.scores = scores;

        document.addEventListener("keydown", (e) => this.onKeyDown(e));
        document.addEventListener("keyup", (e) => this.onKeyUp(e));
    }


    /*Khi giữ phím di chuyển thì khối gạch sẽ di chuyển theo ý người chơi*/
    holdingKey() {
        if (this.keyPressed) {
            this.count += 1;
            if (this.count > 8) {
                this.onKeyHold();
                this.count -= 3;
            }
        }
    }

    /*Đặt lại mọi thứ*/
    reset() {
        this.count = 0;
    }


    /*sự kiện nhấn phím*/
    pressKey(key, event) {
        let number = null;
        if (this.scores.isFocused()) {
            if (key === 13) {
                this.shortcuts.gameOver.O();
            }
        } else {
            if (!this.display.isPlaying()) {
                event.preventDefault();
            }

            if ([8, 66, 78].indexOf(key) > -1) {            // Backspace / B / N
                key = "B";
            } else if ([13, 79, 84].indexOf(key) > -1) {    // Enter / O / T
                key = "O";
            } else if ([80, 67].indexOf(key) > -1) {        // P / C
                key = "P";
            } else if ([17, 32].indexOf(key) > -1) {        // Ctrl / Space
                key = "C";
            } else if ([38, 87].indexOf(key) > -1) {        // Up    / W
                key = "W";
            } else if ([37, 65].indexOf(key) > -1) {        // Left  / A
                key = "A";
            } else if ([40, 83].indexOf(key) > -1) {        // Down  / S
                key = "S";
            } else if ([39, 68].indexOf(key) > -1) {        // Right / D
                key = "D";
            } else {
                if (key === 48 || key === 96) {
                    number = 10;
                } else if (key > 48 && key < 58) {
                    number = key - 48;
                } else if (key > 96 && key < 106) {
                    number = key - 96;
                }
                key = String.fromCharCode(key);
            }

            if (number !== null) {
                this.shortcuts.number(number);
            }
            if (this.shortcuts[this.display.get()][key]) {
                this.shortcuts[this.display.get()][key]();
            }
        }
    }

    /*Xử lí sự kiện bàn phím cho nút xuống*/
    onKeyDown(event) {
        if (this.display.isPlaying() && this.fastKeys.indexOf(event.keyCode) > -1) {
            if (this.keyPressed === null) {
                this.keyPressed = event.keyCode;
            } else {
                return;
            }
        }
        this.pressKey(event.keyCode, event);
    }

    /*Xử lí sự kiện bàn phím cho nút lên*/
    onKeyUp() {
        this.keyPressed = null;
        this.count = 0;
    }

    // Khi một phím được nhấn, phím này được gọi trên mỗi khung để di chuyển phím nhanh
    onKeyHold() {
        if (this.keyPressed !== null && this.display.isPlaying()) {
            this.pressKey(this.keyPressed);
        }
    }
}
//Các hàm xử lí các sự kiện chính trong game
(function () {
    "use strict";

    let display, level, sound, scores, keyboard,
        board, score, tetrisShape,
        animation, startTime,
        soundFiles = ["pause", "crash", "drop", "line", "rotate", "end"],
        tetriminoSize = 2,
        maxInitialLevel = 6;


    function destroyGame() {
        board.clearElements();
        tetrisShape.clearElements();
    }


    /*khung hình động*/
    function requestAnimation() {
        startTime = new Date().getTime();
        animation = window.requestAnimationFrame(() => {
            let time = new Date().getTime() - startTime;

            score.decTime(time);
            if (score.time < 0) {
                tetrisShape.softDrop();
                score.resetTime();
            }
            keyboard.holdingKey();

            if (display.isPlaying() && !board.isWinking()) {
                requestAnimation();
            }
        });
    }

    /*Hủy khung hình động*/
    function cancelAnimation() {
        window.cancelAnimationFrame(animation);
    }


    /*Hiển thị màn hình chính*/
    function showMainScreen() {
        display.set("mainScreen").show();
    }

    /*tạm dừng game*/
    function startPause() {
        display.set("paused").show();
        sound.pause();
        cancelAnimation();
    }

    /*tiếp tục game*/
    function endPause() {
        display.set("playing").hide();
        sound.pause();
        requestAnimation();
    }

    /*Hiển thị trong tạm dừng: trò chơi mới và tiếp tục*/
    function showPause() {
        if (display.isPaused()) {
            endPause();
        } else {
            startPause();
        }
    }
    /*Hiển thị màn hình kết thúc trò chơi*/
    function finishGame() {
        destroyGame();
        showMainScreen();
    }

    /*Hiển thị màn hình kết thúc trò chơi*/
    function showGameOver() {
        display.set("gameOver").show();
        sound.end();
        scores.setInput();
        destroyGame();
    }

    /*Hiển thị điểm cao*/
    function showHighScores() {
        display.set("highScores").show();
        scores.show();
    }

    /*Lưu điểm số*/
    function saveHighScore() {
        if (scores.save(score.level, score.score)) {
            showHighScores();
        }
    }

    /*Hiển thị hướng dẫn*/
    function showHelp() {
        display.set("help").show();
    }


    /*Hàm xử lí khi animation nhấp nháy kết thúc*/
    function onWindEnd() {
        tetrisShape.setHardDrop();
        requestAnimation();
    }

    /*bắt đầu game mới*/
    function newGame() {
        display.set("playing").hide();
        keyboard.reset();
        board = new Board(tetriminoSize, onWindEnd);
        score = new Score(level.get(), maxInitialLevel);
        tetrisShape = new TetrisShape(board, sound, score, tetriminoSize, showGameOver);
        requestAnimation();
    }


    /*Tạo các chức năng phím tắt*/
    function getShortcuts() {
        return {
            mainScreen: {
                O: () => newGame(),
                A: () => level.dec(),
                I: () => showHighScores(),
                D: () => level.inc(),
                H: () => showHelp(),
                M: () => sound.toggle()
            },
            paused: {
                P: () => endPause(),
                B: () => finishGame()
            },
            gameOver: {
                O: () => saveHighScore(),
                B: () => showMainScreen()
            },
            highScores: {
                B: () => showMainScreen(),
                R: () => scores.restore()
            },
            help: {
                B: () => showMainScreen()
            },
            playing: {
                C: () => tetrisShape.hardDrop(),
                W: () => tetrisShape.rotateRight(),
                A: () => tetrisShape.moveLeft(),
                S: () => tetrisShape.softDrop(),
                D: () => tetrisShape.moveRight(),
                X: () => tetrisShape.rotateRight(),
                Z: () => tetrisShape.rotateLeft(),
                P: () => startPause(),
                M: () => sound.toggle()
            },
            number: (number) => {
                if (display.inMainScreen()) {
                    level.choose(number);
                }
            }
        };
    }
    /*Lưu trữ các phần tử đã sử dụng và khởi tạo trình xử lý sự kiện*/
    function initDomListeners() {
        document.body.addEventListener("click", (e) => {
            let element = Utils.getTarget(e),
                actions = {
                    decrease: () => level.dec(),
                    increase: () => level.inc(),
                    start: () => newGame(),
                    mainScreen: () => showMainScreen(),
                    endPause: () => endPause(),
                    pause: () => showPause(),
                    finishGame: () => finishGame(),
                    highScores: () => showHighScores(),
                    help: () => showHelp(),
                    save: () => saveHighScore(),
                    restore: () => scores.restore(),
                    sound: () => sound.toggle()
                };

            if (actions[element.dataset.action]) {
                actions[element.dataset.action]();
            }
        });
    }


    /*Chức năng chính*/
    function main() {
        initDomListeners();

        display = new Display();
        level = new Level(maxInitialLevel);
        sound = new Sounds(soundFiles, "tetris.sound", true);
        scores = new HighScores();
        keyboard = new Keyboard(display, scores, getShortcuts());
    }

    // Load game
    window.addEventListener("load", main, false);
}
());
/*Xử lí phần âm thanh trong trò chơi*/
const Sounds = (function () {
    /*Trả về true nếu trình duyệt hỗ trợ Audio*/
    function supportsAudio() {
        return !!document.createElement("audio").canPlayType;
    }

    /*Trả về true nếu trình duyệt hỗ trợ MP3 Audio*/
    function supportsMP3() {
        var a = document.createElement("audio");
        return !!(a.canPlayType && a.canPlayType("audio/mpeg;").replace(/no/, ""));
    }

    /*Trả về true nếu trình duyệt hỗ trợ OGG Audio*/
    function supportsOGG() {
        var a = document.createElement("audio");
        return !!(a.canPlayType && a.canPlayType("audio/ogg; codecs='vorbis'").replace(/no/, ""));
    }


    function Sounds(soundFiles, storageName, usesElement) {
        this.data = new Storage(storageName, true);
        this.format = supportsOGG() ? ".ogg" : (supportsMP3() ? ".mp3" : null);
        this.mute = !!this.data.get();
        this.old = this.mute;

        if (usesElement) {
            this.audio = document.querySelector(".audio");
            this.waves = document.querySelector(".waves");
        }

        if (this.format) {
            this.setSounds(soundFiles);
            this.setDisplay();
        } else if (this.audio) {
            this.audio.style.display = "none";
        }
    }

    /*Tạo tất cả các chức năng âm thanh*/
    Sounds.prototype.setSounds = function (soundFiles) {
        var audio, self = this;

        soundFiles.forEach(function (sound) {
            self[sound] = function () {
                audio = new Audio("audio/" + sound + self.format);
                if (self.format && !self.mute) {
                    audio.play();
                }
            };
        });
    };

    /*Tắt/Bật âm thanh*/
    Sounds.prototype.toggle = function (mute) {
        this.mute = mute !== undefined ? mute : !this.mute;
        this.setDisplay();
        this.data.set(this.mute ? 1 : 0);
    };

    /*hàm được sử dụng để tắt âm thanh trong một thời gian ngắn*/
    Sounds.prototype.startMute = function () {
        this.old = this.mute;
        this.toggle(true);
    };

    /*Đặt lại âm thanh về lúc ban đầu*/
    Sounds.prototype.endMute = function () {
        this.toggle(this.old);
    };

    /*Trả về true nếu âm thanh tắt và false nếu bật */
    Sounds.prototype.isMute = function () {
        return this.mute;
    };

    /*Đặt hiển thị âm thanh waves(Khi tắt tiếng sẽ mất waves và ngược lại)*/
    Sounds.prototype.setDisplay = function () {
        if (this.waves) {
            this.waves.style.display = this.mute ? "none" : "block";
        }
    };


    return Sounds;
}());

