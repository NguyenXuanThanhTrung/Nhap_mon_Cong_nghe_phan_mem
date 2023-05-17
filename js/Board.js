class Board {

    /*Tạo board game*/
    constructor(tetriminoSize, onWindEnd) {
        this.fieldElem = document.querySelector(".field");
        this.winkElem = document.querySelector(".winker");

        this.tetriminoSize = tetriminoSize;
        this.onWindEnd = onWindEnd;
        this.matrixCols = 12;
        this.matrixRows = 23;
        this.matrix = [];
        this.rows = [];
        this.lines = [];
        this.winks = null;
        this.level = 1;
        this.board = document.querySelector(".board-game");
        for (let i = 0; i < this.matrixRows; i += 1) {
            this.matrix[i] = [];
            this.rows[i] = 0;
            for (let j = 0; j < this.matrixCols; j += 1) {
                this.matrix[i][j] = this.isBorder(i, j) ? 1 : 0;
            }
        }
    }
    /*Kiểm tra xem có sự cố hay không, dựa trên ma trận và vị trí*/
    crashed(top, left, matrix) {
        for (let i = 0; i < matrix.length; i += 1) {
            for (let j = 0; j < matrix[i].length; j += 1) {
                if (matrix[i][j] && this.matrix[top + i][left + j + 1]) {
                    return true;
                }
            }
        }
        return false;
    }

    /*Thêm các khối gạch vào ma trận, kiểm tra cho các khối gạch khi rơi xuống không bị xuyên qua nhau*/
    addToMatrix(element, top, left) {
        this.matrix[top][left + 1] = element;
        this.rows[top] += 1;

        return this.rows[top] === this.matrixCols - 2;
    }

    /*Xóa một hàng khỏi ma trận khi đã hoàn thành 1 hàng*/
    removeLine(line) {
        let i = 1;
        for (; i < this.matrixCols - 1; i += 1) {
            if (this.matrix[line][i]) {
                Utils.removeElement(this.matrix[line][i]);
            }
        }

        i = line - 1;
        while (this.rows[i] > 0) {
            for (let j = 1; j < this.matrixCols - 1; j += 1) {
                this.matrix[i + 1][j] = this.matrix[i][j];
                if (this.matrix[i][j]) {
                    this.matrix[i][j].style.top = this.getTop(i + 1);
                }
            }
            this.rows[i + 1] = this.rows[i];
            i -= 1;
        }
        i += 1;
        for (let j = 1; j < this.matrixCols - 1; j += 1) {
            this.matrix[i][j] = 0;
        }
        this.rows[i] = 0;
    }

    /*Thêm tất cả các khối gạch vào board*/
    addElements(matrix, type, elemTop, elemLeft) {
        let lines = [];

        for (let i = 0; i < matrix.length; i += 1) {
            for (let j = 0; j < matrix[i].length; j += 1) {
                if (matrix[i][j]) {
                    let top = elemTop + i,
                        left = elemLeft + j,
                        elem = this.append(type, top, left);

                    if (this.addToMatrix(elem, top, left)) {
                        lines.push(top);
                    }
                }
            }
        }
        if (lines.length > 0) {
            this.startWink(lines);
        }
        return lines.length;
    }

    /*Tạo một khối gạch mới và thêm nó vào Bảng*/
    append(type, top, left) {
        let element = document.createElement("DIV");
        element.className = "cell" + type;
        element.style.top = this.getTop(top);
        element.style.left = this.getLeft(left);

        this.fieldElem.appendChild(element);
        return element;
    }

    /*Bắt đầu ứng nhấp nháy khi 1 hàng biến mất*/
    startWink(lines) {
        lines.forEach((line) => {
            if (this.lines[line]) {
                this.lines[line].classList.add("wink");
            } else {
                this.lines[line] = this.createWink(line);
            }
        });
        this.winks = lines;
    }

    /*Tạo hiệu ứng nhấp nháy khi 1 hàng biến mất*/
    createWink(top) {
        let element = document.createElement("div");
        element.className = "wink";
        element.style.top = this.getTop(top);
        element.dataset.top = top;

        this.winkElem.appendChild(element);

        element.addEventListener("animationend", () => {
            this.endWink();
        });
        return element;
    }

    /*Kết thúc hiệu ứng nhấp nháy*/
    endWink() {
        if (this.winks) {
            this.winks.forEach((line) => {
                this.lines[line].classList.remove("wink");
                this.removeLine(line);
            });

            this.winks = null;
            this.onWindEnd();
        }
    }

    /*Trả về true nếu board nhấp nháy*/
    isWinking() {
        return this.winks !== null;
    }


    /*Kiểm tra xem đó có phải là đường viền của board hay không, nếu phải trả về true*/
    isBorder(top, left) {
        return top === this.matrixRows - 1 || left === 0 || left === this.matrixCols - 1;
    }

    /*Hàm điểu chỉnh cho khối gạch random luôn rơi từ giữa board*/
    getMiddle(cols) {
        return Math.floor((this.matrixCols - cols - 2) / 2);
    }

    /*Trả về vị trí hàng đầu để random hình dạng*/
    getTop(top) {
        return ((top - 2) * this.tetriminoSize) + "em";
    }

    /*Trả về vị trí bên trái để random hình dạng*/
    getLeft(left) {
        return (left * this.tetriminoSize) + "em";
    }

    /*Xóa các phần tử*/
    clearElements() {
        this.fieldElem.innerHTML = "";
        this.winkElem.innerHTML = "";
    }
}