/*Xử lí các khối gạch*/
class TetrisShape {
    /*Tạo cách khối gạch*/
    constructor(board, sound, score, size, onGameOver) {
        this.tetrisShape = [
            { // Khối gạch hình chữ I
                matrix: [
                    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],     // Rotation 1
                    [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],     // Rotation 2
                    [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],     // Rotation 3
                    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]      // Rotation 4
                ],
                rows: 3,        // Amount of rows at the starting position
                cols: 4         // Amount of columns at the starting position
            },
            { // Khối gạch hình chữ J
                matrix: [
                    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
                    [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
                    [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
                    [[0, 1, 0], [0, 1, 0], [1, 1, 0]]
                ],
                rows: 2,
                cols: 3
            },
            { // Khối gạch hình chữ L
                matrix: [
                    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
                    [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
                    [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
                    [[1, 1, 0], [0, 1, 0], [0, 1, 0]]
                ],
                rows: 2,
                cols: 3
            },
            { // Khối gạch hình chữ O
                matrix: [
                    [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
                    [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
                    [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
                    [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]
                ],
                rows: 2,
                cols: 4
            },
            { // Khối gạch hình chữ S
                matrix: [
                    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
                    [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
                    [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
                    [[1, 0, 0], [1, 1, 0], [0, 1, 0]]
                ],
                rows: 2,
                cols: 3
            },
            { // Khối gạch hình chữ T
                matrix: [
                    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
                    [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
                    [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
                    [[0, 1, 0], [1, 1, 0], [0, 1, 0]]
                ],
                rows: 2,
                cols: 3
            },
            { // Khối gạch hình chữ Z
                matrix: [
                    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
                    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
                    [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
                    [[0, 1, 0], [1, 1, 0], [1, 0, 0]]
                ],
                rows: 2,
                cols: 3
            }
        ];

        this.board = board;
        this.sound = sound;
        this.score = score;
        this.size = size;
        this.onGameOver = onGameOver;
        this.sequence = [0, 1, 2, 3, 4, 5, 6];
        this.pointer = this.sequence.length;

        this.actual = this.createTetrisShape().fall();
        this.next = this.createTetrisShape();
    }

    /*Tạo một TetrisShape mới*/
    createTetrisShape() {
        let type = this.getNextType();
        return new Tetrimino(this.board, type, this.tetrisShape[type], this.size);
    }

    /*Tăng con trỏ hiện tại và nếu được yêu cầu, nó sẽ tạo một hoán vị mới của 7 khối gạch
và sau đó nó trả về loại tiếp theo*/
    getNextType() {
        if (this.pointer < this.sequence.length - 1) {
            this.pointer += 1;
        } else {
            for (let i = 0; i < this.sequence.length; i += 1) {
                let pos = Utils.rand(0, this.sequence.length - 1),
                    aux = this.sequence[pos];

                this.sequence[pos] = this.sequence[i];
                this.sequence[i] = aux;
            }
            this.pointer = 0;
        }
        return this.sequence[this.pointer];
    }

    /*Hàm thả gạch*/
    softDrop() {
        if (this.actual.softDrop()) {
            this.crashed();
        }
    }

    hardDrop() {
        this.actual.hardDrop();
        this.crashed();
        this.sound.drop();
    }

    /* Được gọi khi các khối gạch đã cao bằng với chiều cao của board ==> game over */
    crashed() {
        if (this.actual.getTop() === 0 || this.actual.getTop() === 1) {
            this.onGameOver();
            return;
        }

        this.score.block(this.actual.getDrop());
        let lines = this.actual.addElements();
        if (lines) {
            this.sound.line();
            this.score.line(lines);
        }
        this.sound.crash();
        this.dropNext();
    }

    /*hàm thả khối gạch tiếp theo và tạo một cái mới*/
    dropNext() {
        this.actual = this.next.fall();
        this.next = this.createTetrisShape();
    }
    /*Hàm xoay khối gạch sang phải*/
    rotateRight() {
        if (this.actual.rotateRight()) {
            this.sound.rotate();
        }
    }

    /*Hàm xoay khối gạch sang trái*/
    rotateLeft() {
        if (this.actual.rotateLeft()) {
            this.sound.rotate();
        }
    }

    /*Hàm di chuyển khối gạch sang phải*/
    moveRight() {
        this.actual.moveRight();
    }

    /*Hàm di chuyển khối gạch sang trái*/
    moveLeft() {
        this.actual.moveLeft();
    }

    /*Đặt vị trí thả cứng của khối gạch*/
    setHardDrop() {
        this.actual.setHardDrop();
    }
    /*Xóa các phần tử*/
    clearElements() {
        this.actual.clearElements();
    }
}