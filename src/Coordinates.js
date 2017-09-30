"use strict";

Lyngk.Coordinates = function (c, l) {
    var private_column, private_line, private_state, private_color, private_count;

    this.is_valid = function(){

        var not_valid_positions = ["A1", "A2", "A4", "A5", "A6", "A7", "A8", "A9",
                                   "B1", "B6", "B7", "B8", "B9",
                                   "C8", "C9",
                                   "D1", "D8", "D9",
                                   "E1", "E9",
                                   "F1", "F2", "F9",
                                   "G1", "G2",
                                   "H1", "H2", "H3", "H4", "H9",
                                   "I1", "I2", "I3", "I4", "I5", "I6", "I8", "I9"];
        return (not_valid_positions.indexOf(private_column + private_line) < 0);
    };

    var init = function(c, l){
        private_column = c;
        private_line = l;
        private_state = "VACANT";
        private_count = 0;
    };

    this.representation = function(){
        if (this.is_valid() === false) {
            return "invalid";
        } else {
            return private_column + private_line;
        }
    };

    this.clone = function(){
        return new Lyngk.Coordinates(private_column, private_line);
    };

    this.hash = function(){
        return private_column.charCodeAt(0) + private_line;
    };

    this.get_state = function(){
        return private_state;
    };

    this.get_color = function(){
        return private_color;
    };

    this.get_count = function(){
        return private_count;
    };

    this.put = function(piece) {
        if (private_state !== "FULL_STACK"){
            if (private_count === 0){
                private_state = "ONE_PIECE";
            }
            else if (private_count === 4){
                private_state = "FULL_STACK";
            }
            else {
                private_state = "STACK";
            }
            private_color = piece.get_color();
            private_count += 1;
        }
    };

    init(c, l);
};
