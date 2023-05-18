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
