"use strict";

Lyngk.Coordinates = function (c, l) {

    this.is_valid = function(){

        var valid_column_indexes = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

        var not_valid_positions = ["A1", "A2", "A4", "A5", "A6", "A7", "A8", "A9", "B1", "B6", "B7", "B8", "B9", "C8", "C9", "D1", "D8", "D9","E1", "E9", "F1", "F2", "F9", "G1", "G2", "H1", "H2", "H3", "H4", "H9", "I1", "I2", "I3", "I4", "I5", "I6", "I8", "I9"];

        if (not_valid_positions.indexOf(this.private_column + this.private_line) === -1){
            return false;
        } else {
            return true;
        };
    };

    var init = function(c, l){
        var private_column = c;
        var private_line = l;
    };

    init(c, l);
};
