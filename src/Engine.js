"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};

Lyngk.Engine = function () {
    var private_coordinates = [];
    var private_pieces;


    var get_random_piece = function(){
        var colors = Object.keys(private_pieces);
        var color = colors[Math.floor(Math.random(colors.length))];
        private_pieces[color] -= 1;
        if (private_pieces[color] === 0){
            delete private_pieces[color];
        }
        return new Lyngk.Piece(color);
    };

    var init_pieces = function(){
        return {"BLACK": 8, "BLUE": 8, "IVORY": 8, "GREEN": 8, "RED": 8, "WHITE": 3};
    };

    var init = function(){
        var columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
        var lines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        private_pieces = init_pieces();
        for (var c in columns){
            for (var l in lines){
                var coordinate = new Lyngk.Coordinates(columns[c], lines[l]);
                if (coordinate.is_valid() === true) {
                    var piece = get_random_piece();
                    coordinate.put(piece);
                    var pos = coordinate.hash();
                    private_coordinates[pos] = coordinate;
                }
            }
        }
    };

    this.get_coordinates = function() {
        return private_coordinates;
    };

    init();
};
