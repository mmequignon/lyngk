"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};
Lyngk.Lines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
Lyngk.Columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

Lyngk.Engine = function () {
    var private_intersections = [];
    var private_pieces;
    var private_players = ['Joueur 1', 'Joueur 2'];
    var private_player_colors;
    var private_player_scores;
    var private_turn;


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
        Math.seedrandom('isidis-i2l');
        private_pieces = init_pieces();
        private_player_colors = [];
        private_player_scores = [0, 0];
        private_turn = 0;
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
        if (this.move_is_valid(hash_from, hash_to) === true) {
            while (private_intersections[hash_from].get_state() !== "VACANT") {
                private_intersections[hash_to].put(private_intersections[hash_from].shift());
            }
            if (this.player_get_point(hash_to, this.get_player_color(private_turn % 2))){
                private_player_scores[private_turn % 2] += 1;
                private_intersections[hash_to].flush();
            }
            private_turn += 1;
        }
    };

    this.not_opponent_color_in_stacks = function (hash_from, hash_to){
        var from_intersection = private_intersections[hash_from];
        var to_intersection = private_intersections[hash_to];
        var opponent_color = private_player_colors[(private_turn + 1) % 2];
        for (var from_piece in from_intersection.get_pieces()){
            if( from_intersection.get_pieces()[from_piece].get_color() === opponent_color ){
                return false;
            }
        }
        for (var to_piece in to_intersection.get_pieces()){
            if ( to_intersection.get_pieces()[to_piece].get_color() === opponent_color ){
                return false;
            }
        }
        return true;
    };


    this.move_is_valid = function(hash_from, hash_to){
        var intersections = this.get_intersections();
        var is_neighbour = [1, 9, 10].indexOf(Math.abs(hash_from - hash_to)) > -1;
        var move_to_stack = private_intersections[hash_to].get_state() !== "VACANT";
        var inferior_size = (intersections[hash_from].get_count() - intersections[hash_to].get_count());
        var from_stack_colors = [];
        var from_pieces = intersections[hash_from].get_pieces();
        var to_pieces = intersections[hash_to].get_pieces();
        for (var piece in from_pieces){
            from_stack_colors += from_pieces[piece].get_color();
        }
        var to_stack_colors = [];
        for (var piece in to_pieces){
            to_stack_colors += to_pieces[piece].get_color();
        }
        var not_color_double = true;
        for (var color in to_stack_colors){
            if (to_stack_colors[color] === "WHITE"){
                continue;
            }
            if (from_stack_colors.indexOf(to_stack_colors[color]) > -1){
                not_color_double = false;
                break;
            }
        }
        var sum_from_to = this.get_intersections()[hash_from].get_count() + this.get_intersections()[hash_to].get_count();
        return (is_neighbour &&
                move_to_stack &&
                sum_from_to <= 5 &&
                inferior_size > -1 &&
                this.not_opponent_color_in_stacks(hash_from, hash_to) &&
                not_color_double === false);
    };

    this.player_get_point = function(hash, color){
        var stack_is_full = (private_intersections[hash].get_state() === 'FULL_STACK');
        var same_color = (private_intersections[hash].get_color() === color);
        return (stack_is_full && same_color);
    };

    this.get_current_player = function(){
        return private_players[private_turn % 2];
    };

    this.ask_color = function(color){
        private_player_colors[private_turn % 2] = color;
    };

    this.get_player_color = function(player){
        return private_player_colors[player];
    };

    this.get_player_score = function(player){
        return private_player_scores[player];
    };

    init();
};