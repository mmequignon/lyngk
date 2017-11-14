"use strict";

Lyngk.Coordinates = function (c, l) {
    var private_column, private_line;

    this.is_valid = function () {

        var not_valid_positions = [
            "A1", "A2", "A4", "A5", "A6", "A7", "A8", "A9",
            "B1", "B6", "B7", "B8", "B9", "C8", "C9",
            "D1", "D8", "D9", "E1", "E9", "F1", "F2", "F9", "G1", "G2",
            "H1", "H2", "H3", "H4", "H9",
            "I1", "I2", "I3", "I4", "I5", "I6", "I8", "I9"
        ];
        return (
            not_valid_positions.indexOf(private_column + private_line) < 0
        );
    };

    var init = function (c, l) {
        private_column = c;
        private_line = l;
    };

    this.representation = function () {
        var valid = this.is_valid() === true;
        if (valid) {
            return private_column + private_line;
        }
        return "invalid";
    };

    this.clone = function () {
        return new Lyngk.Coordinates(private_column, private_line);
    };

    this.hash = function () {
        return parseInt(private_column.charCodeAt(0) + "" + private_line, 10);
    };


    init(c, l);
};
