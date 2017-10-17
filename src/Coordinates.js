"use strict";

Lyngk.Coordinates = function (c, l) {
    var private_column, private_line, private_pieces;

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
        private_pieces = [];
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
        return parseInt(private_column.charCodeAt(0) + "" + private_line, 10);
    };

    this.get_state = function(){
        if (private_pieces.length === 0){
            return "VACANT";
        }
        else if (private_pieces.length === 5){
            return "FULL_STACK";
        }
        else if (private_pieces.length === 1){
            return "ONE_PIECE";
        }
        else{
            return "STACK";
        }
    };

    this.get_color = function(){
        return private_pieces[private_pieces.length - 1].get_color();
    };

    this.get_count = function(){
        return private_pieces.length;
    };

    this.put = function(piece) {
        if (this.get_state() !== "FULL_STACK"){
            private_pieces.push(piece);
        }
    };

    this.get_pieces = function(){
        return private_pieces;
    };

    init(c, l);
};
