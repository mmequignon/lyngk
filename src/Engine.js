"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};
Lyngk.Lines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
Lyngk.Columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

Lyngk.Engine = function () {
    var private_coordinates = [];
    var private_pieces;


    var get_random_piece = function(){
        var colors = Object.keys(private_pieces);
        var color = colors[Math.floor(Math.random()*colors.length)];
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
        private_pieces = init_pieces();
        for (var l in Lyngk.Lines){
            for (var c in Lyngk.Columns){
                var coordinate = new Lyngk.Coordinates(Lyngk.Columns[c], Lyngk.Lines[l]);
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

    this.get_color_count = function(){
        var color_count = {"BLACK": 0, "IVORY": 0, "BLUE": 0, "RED": 0, "GREEN": 0, "WHITE": 0};
        for (var l in Lyngk.Lines) {
            for (var c in Lyngk.Columns) {
                var coordinate = new Lyngk.Coordinates(Lyngk.Columns[c], Lyngk.Lines[l]);
                if (coordinate.is_valid() === true) {
                    var pos = coordinate.hash();
                    color_count[private_coordinates[pos].get_color()] += 1;
                }
            }
        }
        return color_count;
    };

    init();
};
