/*Xử lí sự kiện cho khối gạch*/
class Tetrimino {
    constructor(board, type, data, size) {
        this.tetriminer = document.querySelectorAll(".tetrisShape > div");
        this.nextElem = document.querySelector("#next");
        this.blockElem = document.querySelector("#block");
        this.ghostElem = document.querySelector("#ghost");

        this.nexterWidth = 9.6;
        this.nexterHeight = 6.3;
        this.maxRotation = 3;

        this.board = board;
        this.type = type;
        this.data = data;
        this.size = size;
        this.border = 0.2;
        this.top = 0;
        this.left = 0;
        this.rotation = 0;
        this.hard = 0;
        this.drop = 0;

        this.nextElem.className = "block" + this.type + " rot0";
        this.nextElem.innerHTML = this.tetriminer[this.type].innerHTML;
        this.nextElem.style.top = (this.nexterHeight - this.data.rows * this.size - this.border) / 2 + "em";
        this.nextElem.style.left = (this.nexterWidth - this.data.cols * this.size - this.border) / 2 + "em";

        this.setBlockLocation();
    }
    /* đặt vị trí của mỗi khối gạch*/
    setBlockLocation() {
        let elements = this.nextElem.querySelectorAll("div");

        for (let i = 0; i < elements.length; i += 1) {
            elements[i].style.top = (elements[i].dataset.top * this.size) + "em";
            elements[i].style.left = (elements[i].dataset.left * this.size) + "em";
        }
    }
    /*làm cho khối gạch bắt đầu rơi*/
    fall() {
        this.left = this.board.getMiddle(this.data.cols);
        this.hard = this.getHardDrop();

        this.blockElem.className = "block" + this.type + " rot0";
        this.blockElem.innerHTML = this.nextElem.innerHTML;

        this.ghostElem.className = "rot0";
        this.ghostElem.innerHTML = this.nextElem.innerHTML;

        this.setDropPosition();
        return this;
    }
    /*Di chuyển khối gạch xuống một ô*/
    softDrop() {
        if (this.crashed(1, 0)) {
            return true;
        }

        this.top += 1;
        this.drop += 1;
        this.setDropPosition();
        return false;
    }
    /*Di chuyển khối gạch đến ô dưới cùng*/
    hardDrop() {
        this.top = this.getHardDrop();
        this.setDropPosition();
    }

    /* Được gọi khi khối gạch chạm vào cuối màn hình hoặc đỉnh của một khối gạch khác*/
    addElements() {
        return this.board.addElements(this.getMatrix(), this.type, this.top, this.left);
    }
    /*Di chuyển khối gạch sang trái một ô*/
    moveLeft() {
        if (!this.crashed(0, -1)) {
            this.left -= 1;
            this.hard = this.getHardDrop();
            this.setDropPosition();
        }
    }

    /*Di chuyển Tetrimino sang phải một ô*/
    moveRight() {
        if (!this.crashed(0, 1)) {
            this.left += 1;
            this.hard = this.getHardDrop();
            this.setDropPosition();
        }
    }

    /*Xoay khối gạch theo chiều kim đồng hồ*/
    rotateRight() {
        let rotation = this.rotation + 1;
        if (rotation > this.maxRotation) {
            rotation = 0;
        }
        return this.rotate(rotation);
    }

    /*Xoay Tetrimino ngược chiều kim đồng hồ*/
    rotateLeft() {
        let rotation = this.rotation - 1;
        if (rotation < 0) {
            rotation = this.maxRotation;
        }
        return this.rotate(rotation);
    }

    /*Kiểm tra xem khối gạch có được xoay*/
    rotate(rotation) {
        if (!this.crashed(0, 0, rotation)) {
            this.blockElem.classList.remove("rot" + this.rotation);
            this.blockElem.classList.add("rot" + rotation);
            this.ghostElem.classList.remove("rot" + this.rotation);
            this.ghostElem.classList.add("rot" + rotation);

            this.rotation = rotation;
            this.setHardDrop();
            return true;
        }
        return false;
    }

    /*Đặt vị trí của khối gạch và ghost(bóng của khối gạch)*/
    setDropPosition() {
        this.blockElem.style.top = this.board.getTop(this.top);
        this.blockElem.style.left = this.board.getLeft(this.left);
        this.ghostElem.style.top = this.board.getTop(this.hard);
        this.ghostElem.style.left = this.board.getLeft(this.left);
    }

    /*Trả về một ma trận của khối gạch đã quay*/
    getMatrix(rotation) {
        let rot = rotation || rotation === 0 ? rotation : this.rotation;
        return this.data.matrix[rot];
    }
    /*Đặt ô dưới cùng*/
    setHardDrop() {
        this.hard = this.getHardDrop();
        this.setDropPosition();
    }
    /*Lấy ô dưới cùng*/
    getHardDrop() {
        let add = 1;
        while (!this.crashed(add, 0)) {
            add += 1;
        }
        return this.top + add - 1;
    }
    /*Trả về một sự cố có thể xảy ra từ ma trận*/
    crashed(addTop, addLeft, rotation) {
        return this.board.crashed(this.top + addTop, this.left + addLeft, this.getMatrix(rotation));
    }
    /*Trả lại vị trí hàng đầu*/
    getTop() {
        return this.top;
    }
    /*Trả về bộ đếm điểm số*/
    getDrop() {
        return this.drop;
    }
    //
    /*Xóa các phần tử*/
    clearElements() {
        this.nextElem.innerHTML = "";
        this.blockElem.innerHTML = "";
        this.ghostElem.innerHTML = "";
    }
}