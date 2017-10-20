"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};
Lyngk.Lines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
Lyngk.Columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

Lyngk.Engine = function () {
    var private_intersections = [];
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
                    var intersection = new Lyngk.Intersection(coordinate);
                    var piece = get_random_piece();
                    intersection.put(piece);
                    var pos = coordinate.hash();
                    private_intersections[pos] = intersection;
                }
            }
        }
    };

    this.get_intersections = function() {
        return private_intersections;
    };


    this.move_stack = function(hash_from, hash_to){
        if ((private_intersections[hash_to].get_state() !== "VACANT") &&
                (this.move_is_valid(hash_from, hash_to) === true)) {
            while (private_intersections[hash_from].get_state() !== "VACANT") {
                private_intersections[hash_to].put(private_intersections[hash_from].shift());
            }
        }
    };


    this.move_is_valid = function(hash_from, hash_to){
        var intersections = this.get_intersections();
        var is_neighbour = [1, 9, 10].indexOf(Math.abs(hash_from - hash_to)) > -1;
        var from_state = intersections[hash_from].get_state();
        var inferior_size = (intersections[hash_from].get_count() - intersections[hash_to].get_count());
        return (is_neighbour && (from_state !== "FULL_STACK") && (inferior_size > -1));
    };

    init();
};

