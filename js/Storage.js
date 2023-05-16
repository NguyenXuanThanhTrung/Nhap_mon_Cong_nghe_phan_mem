/*Tạo một Bộ lưu trữ mới. Bộ lưu trữ sử dụng khả năng lưu trữ cục bộ để lưu dữ liệu JSON*/
var
    Storage = (function () {
        "use strict";

        /*Trả về true nếu bộ nhớ được hỗ trợ*/
        function supportsStorage() {
            return window.localStorage !== "undefined" && window.localStorage !== null;
        }

        /*Trả về true nếu chuỗi là số nguyên*/
        function isInteger(string) {
            var validChars = "0123456789-", isNumber = true, i, char;

            for (i = 0; i < string.length && isNumber === true; i += 1) {
                char = string.charAt(i);
                if (validChars.indexOf(char) === -1) {
                    isNumber = false;
                }
            }
            return isNumber;
        }


        function Storage(name, single) {
            this.name = name;
            this.single = single || false;
            this.supports = supportsStorage();
        }

        /*Trả về dữ liệu ở định dạng đã lưu*/
        Storage.prototype.get = function (name) {
            var content = null;

            if (this.supports && window.localStorage[this.getName(name)]) {
                content = window.localStorage[this.getName(name)];
                if (content === "true" || content === "false") {
                    content = content === "true";
                } else if (isInteger(content)) {
                    content = parseInt(content, 10);
                } else {
                    content = JSON.parse(content);
                }
            }
            return content;
        };

        /*Lưu dữ liệu đã có dưới dạng đối tượng JSON*/
        Storage.prototype.set = function (name, value) {
            if (this.supports) {
                if (this.single) {
                    value = name;
                    name = "";
                }
                window.localStorage[this.getName(name)] = JSON.stringify(value);
            }
        };

        /*Xóa dữ liệu với tên đã cho*/
        Storage.prototype.remove = function (name) {
            if (this.supports) {
                window.localStorage.removeItem(this.getName(name));
            }
        };


        /*Trả về key cho tên đã cho*/
        Storage.prototype.getName = function (name) {
            return this.name + (name ? "." + name : "");
        };

        /*Trả về true nếu bộ nhớ được hỗ trợ*/
        Storage.prototype.isSupported = function () {
            return this.supports;
        };


        return Storage;
    }());

let
    Utils = (function () {
        "use strict";

        return {
            /*Trả về một giá trị ngẫu nhiên giữa from và to*/
            rand(from, to) {
                return Math.floor(Math.random() * (to - from + 1) + from);
            },

            /*Trả về giá trị cao hơn min và thấp hơn max */
            clamp(value, min, max) {
                return Math.max(min, Math.min(max, value));
            },

            /*Thêm dấu phân cách cứ sau 3 chữ số thập phân ở phần điểm số*/
            formatNumber(number, separator) {
                let result = "", count = 0, char;
                number = String(number);

                for (let i = number.length - 1; i >= 0; i -= 1) {
                    char = number.charAt(i);
                    count += 1;
                    result = char + result;

                    if (count === 3 && i > 0) {
                        result = separator + result;
                        count = 0;
                    }
                }
                return result;
            },

            /*Trả về góc giữa hai giá trị*/
            calcAngle(x, y) {
                let angle = Math.round(Math.abs(Math.atan(y / x) * 180 / Math.PI));
                if (y < 0 && x >= 0) {
                    angle = 360 - angle;
                } else if (y < 0 && x < 0) {
                    angle = 180 + angle;
                } else if (y >= 0 && x < 0) {
                    angle = 180 - angle;
                }
                return angle;
            },


            /*Trả về phần tử gần nhất với một action*/
            getTarget(event) {
                let element = event.target;
                while (element.parentElement && !element.dataset.action) {
                    element = element.parentElement;
                }
                return element;
            },

            /*Trả về vị trí của một phần tử trong HTML*/
            getPosition(element) {
                let top = 0, left = 0;
                if (element.offsetParent !== undefined) {
                    top = element.offsetTop;
                    left = element.offsetLeft;

                    while (element.offsetParent && typeof element.offsetParent === "object") {
                        element = element.offsetParent;
                        top += element.offsetTop;
                        left += element.offsetLeft;
                    }
                } else if (element.x !== undefined) {
                    top = element.y;
                    left = element.x;
                }
                return {top, left};
            },

            /*Đặt vị trí của phần tử hoặc phần tử đã cho*/
            setPosition(element, top, left) {
                element.style.top = top + "px";
                element.style.left = left + "px";
            },

            /*Xóa phần tử khỏi DOM*/
            removeElement(element) {
                var parent = element.parentNode;
                parent.removeChild(element);
            },


            /*Trả về vị trí chuột*/
            getMousePos(event) {
                let top = 0, left = 0;
                if (!event) {
                    event = window.event;
                }
                if (event.pageX) {
                    top = event.pageY;
                    left = event.pageX;
                } else if (event.clientX) {
                    top = event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
                    left = event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
                }
                return {top, left};
            },

            /*Bỏ chọn các phần tử*/
            unselect() {
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                } else if (document.selection) {
                    document.selection.empty();
                }
            }
        };
    }());