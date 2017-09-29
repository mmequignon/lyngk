"use strict";

Lyngk.Coordinates = function (c, l) {
    var private_column, private_line;

    this.is_valid = function(){

        var not_valid_positions = ["A1", "A2", "A4", "A5", "A6", "A7", "A8", "A9", "B1", "B6", "B7", "B8", "B9", "C8", "C9", "D1", "D8", "D9","E1", "E9", "F1", "F2", "F9", "G1", "G2", "H1", "H2", "H3", "H4", "H9", "I1", "I2", "I3", "I4", "I5", "I6", "I8", "I9"];
        if (not_valid_positions.indexOf(private_column + private_line) !== -1){
            return false;
        } else {
            return true;
        }
    };

    var init = function(c, l){
        private_column = c;
        private_line = l;
    };

    this.representation = function(){
      return private_column + private_line;
    };

    init(c, l);
};
