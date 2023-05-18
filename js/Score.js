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

