"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};

Lyngk.Engine = function () {
    var private_coordinates = [];

    var init = function(){
        var columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
        var lines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var piece = new Lyngk.Piece("blue");
        for (var c in columns){
            for (var l in lines){
                var coordinate = new Lyngk.Coordinates(c, l);
                if (coordinate.is_valid() === true) {
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
