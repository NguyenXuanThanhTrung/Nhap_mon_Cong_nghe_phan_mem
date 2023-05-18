/*Xử lí phần điểm số*/
class Score {

    constructor(level, maxInitialLevel) {
        this.multipliers = [40, 100, 300, 1200];
        this.timeInterval = 50;
        this.linesPerLevel = 6;
        this.maxInitialLevel = maxInitialLevel;

        this.levelElem = document.querySelector(".level .content");
        this.scoreElem = document.querySelector(".score .content");
        this.linesElem = document.querySelector(".lines .content");

        this._level = level;
        this._score = 0;
        this._lines = 0;
        this._amount = 0;
        this._timer = this.calculateTimer();
        this._time = this._timer;

        this.showLevel();
        this.showScore();
        this.showLines();
    }
//Các hàm time xử lí thời gian thả gạch
    /*Hàm trả về thời gian giữa mỗi lần thả*/
    get timer() {
        return this._timer;
    }

    /*Hàm trả về thời gian hiện tại*/
    get time() {
        return this._time;
    }

    /*Hàm trả về cấp độ hiện tại*/
    get level() {
        return this._level;
    }

    /*Hàm trả về điểm hiện tại*/
    get score() {
        return this._score;
    }


    /*Giảm thời gian theo số điềm nhất định*/
    decTime(time) {
        this._time -= time;
    }

    /*Đặt lại thời gian*/
    resetTime() {
        this._time = this._timer;
    }


    /*Phương thức này được gọi khi một khối gạch rơi xuống và được đặt vào vị trí cuối cùng của bảng chơi. Tham số "drop" là số lượng ô trống mà khối gạch đã rơi xuống.
    * Điểm số được tính bằng cách cộng thêm 21 và nhân với 3 lần cấp độ hiện tại của người chơi, sau đó trừ đi số ô trống mà khối gạch đã rơi xuống. Kết quả của phép tính này sẽ được cộng vào biến "this._score"*/
    block(drop) {
        this._score += 21 + (3 * this._level) - drop;
        this.showScore();
    }

    /*Cộng điểm cho một dòng mới hoàn thành*/
    line(amount) {
        this.addScore(amount);
        this.addLine(amount);
        this.addLevel(amount);
    }

    /*Hàm tăng điểm*/
    addScore(amount) {
        this._score += this._level * this.multipliers[amount - 1];
        this.showScore();
    }

    /*Hàm tăng dòng*/
    addLine(amount) {
        this._lines += amount;
        this.showLines();
    }

    /*Hàm tăng cấp độ*/
    addLevel(amount) {
        this._amount += amount;
        if (this._amount >= this.linesPerLevel) {
            this._amount -= this.linesPerLevel;
            this._timer = this.calculateTimer();
            this._level += 1;
            this.showLevel();
        }
    }

    /*Hiển thị cấp độ trong game*/
    showLevel() {
        this.levelElem.innerHTML = this._level;
    }

    /*Hiển thị điểm số trong game*/
    showScore() {
        this.scoreElem.innerHTML = Utils.formatNumber(this._score, ",");
    }

    /*Hiển thị số dòng đã ăn được trong game*/
    showLines() {
        this.linesElem.innerHTML = this._lines;
    }


    /*Tính thời gian giữa mỗi lần thả gạch*/
    calculateTimer() {
        if (this.level < this.maxInitialLevel) {
            return (this.maxInitialLevel - this.level + 1) * this.timeInterval;
        }
        return this.timeInterval;
    }
}

/*Xử lí phần điểm cao*/
class HighScores {

    constructor() {
        this.input = document.querySelector(".input input");
        this.scores = document.querySelector(".scores");
        this.none = document.querySelector(".none");
        this.data = new Storage("tetris.hs");
        this.total = this.data.get("total") || 0;
        this.focused = false;
        this.maxScores = 9;

        this.input.onfocus = () => this.focused = true;
        this.input.onblur = () => this.focused = false;
    }

    /*Hiển thị điểm cao*/
    show() {
        this.scores.innerHTML = "";
        this.showHideNone(this.total === 0);

        if (this.total > 0) {
            this.displayTitles();
            this.displayScores();
        }
    }

    /*Tạo tiêu đề và đặt nó vào html*/
    displayTitles() {
        let div = this.createContent("name", "lvl", "score");
        div.className = "titles";
        this.scores.appendChild(div);
    }

    /*Tạo từng dòng điểm và đặt nó vào html*/
    displayScores() {
        for (let i = 1; i <= this.total; i += 1) {
            let data = this.data.get(i),
                div = this.createContent(data.name, data.level, Utils.formatNumber(data.score, ","));

            div.className = "highScore";
            this.scores.appendChild(div);
        }
    }

    /*Tạo nội dung cho từng điểm cao*/
    createContent(name, level, score) {
        let namer = "<div class='left'>" + name + " -</div>",
            lvler = "<div class='middle'>" + level + "</div>",
            screr = "<div class='right'>- " + score + "</div>",
            element = document.createElement("DIV");

        element.innerHTML = namer + lvler + screr;
        return element;
    }

    /*Lưu điểm của người chơi*/
    save(level, score) {
        if (this.input.value) {
            this.saveData(level, score);
            return true;
        }
        return false;
    }

    /*Lấy điểm và thêm điểm mới vào đúng vị trí, cập nhật tổng điểm*/
    saveData(level, score) {
        let data = [],
            saved = false,
            actual = {
                name: this.input.value,
                level: level,
                score: score
            };

        for (let i = 1; i <= this.total; i += 1) {
            let hs = this.data.get(i);
            if (!saved && hs.score < actual.score) {
                data.push(actual);
                saved = true;
            }
            if (data.length < this.maxScores) {
                data.push(hs);
            }
        }
        if (!saved && data.length < this.maxScores) {
            data.push(actual);
        }

        this.data.set("total", data.length);
        data.forEach((element, index) => {
            this.data.set(index + 1, element);
        });
        this.total = data.length;
    }

    /*khôi phục điểm lại mặc định(không có điểm)*/
    restore() {
        for (let i = 1; i <= this.total; i += 1) {
            this.data.remove(i);
        }
        this.data.set("total", 0);
        this.show();
    }


    /*Hiển thị hoặc ẩn phần tử không có kết quả*/
    showHideNone(show) {
        this.none.style.display = show ? "block" : "none";
    }

    /*Đặt giá trị đầu vào và tập trung vào nó*/
    setInput() {
        this.input.value = "";
        this.input.focus();
    }

    /*Trả về true nếu đầu vào là tiêu điểm*/
    isFocused() {
        return this.focused;
    }
}
