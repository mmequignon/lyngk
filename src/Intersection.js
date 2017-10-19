"use strict";

Lyngk.State = {VACANT: 0, ONE_PIECE: 1, STACK: 2, FULL_STACK: 3};

Lyngk.Intersection = function (c) {
    var private_coordinate, private_pieces;

    var init = function(coordinate){
        private_coordinate = coordinate;
        private_pieces = [];
    }

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
        return (this.get_count() > 0) ? private_pieces[private_pieces.length - 1].get_color() : "NONE";
    };

    this.get_count = function(){
        return private_pieces.length;
    };

    this.put = function(piece) {
        if (this.get_state() !== "FULL_STACK"){
            private_pieces.push(piece);
        }
    };

    this.pop = function() {
        return private_pieces.pop();
    };

    this.shift = function(){
        return private_pieces.shift();
    };

    this.get_pieces = function(){
        return private_pieces;
    };

    init(c);
};
