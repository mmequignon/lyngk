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
    var private_winner = false;


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
        return ((from_intersection.get_color() === opponent_color) || (to_intersection.get_color() === opponent_color)) === false;
    };

    this.is_neighbour = function (hash_from, hash_to) {
        return [1, 9, 10].indexOf(Math.abs(hash_from - hash_to)) > -1;
    };

    this.target_not_vacant = function (hash_to) {
        return private_intersections[hash_to].get_state() !== "VACANT";
    };

    this.inferior_source = function (hash_from, hash_to) {
        return (private_intersections[hash_from].get_count() - private_intersections[hash_to].get_count()) > -1;
    };

    this.not_color_double = function (hash_from, hash_to) {
        for (var from_indice in private_intersections[hash_from].get_pieces()){
            var from_color = private_intersections[hash_from].get_pieces()[from_indice].get_color();
            for (var to_indice in private_intersections[hash_to].get_pieces()){
                var to_color = private_intersections[hash_to].get_pieces()[to_indice].get_color();
                if (to_color === "WHITE"){
                    continue;
                }
                if (to_color === from_color){
                    return false
                }
            }
        }
        return true;
    };

    this.stacks_sum_size_is_valid = function(hash_from, hash_to){
        return private_intersections[hash_from].get_count() + private_intersections[hash_to].get_count() <= 5;
    };

    this.not_white_and_first_turn = function(hash_from){
        if (private_turn === 0 && private_intersections[hash_from].get_color() === "WHITE"){
            return false;
        }
        return true;
    };

    this.move_is_valid = function(hash_from, hash_to){
        return (this.is_neighbour(hash_from, hash_to) &&
                this.target_not_vacant(hash_to) &&
                this.stacks_sum_size_is_valid(hash_from, hash_to) &&
                this.inferior_source(hash_from, hash_to) &&
                this.not_opponent_color_in_stacks(hash_from, hash_to) &&
                this.not_color_double(hash_from, hash_to) &&
                this.not_white_and_first_turn(hash_from));
    };

    this.player_get_point = function(hash, color){
        var stack_is_full = (private_intersections[hash].get_state() === 'FULL_STACK');
        var stack_color = private_intersections[hash].get_color();
        var same_color = (stack_color === color || stack_color === "WHITE");
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

    this.neighbours = function(hash){
        var neighbours = [];
        var hashs = [hash - 10, hash - 9, hash - 1, hash + 1, hash + 9, hash + 10];
        for (var h in hashs){
            if ( private_intersections[hashs[h]] !== void 0){
                neighbours.push(hashs[h]);
            }
        }
        return neighbours;
    };

    this.is_movable = function(hash_from){
        var neighbours = this.neighbours(hash_from);
        for (var neighbour in neighbours){
            var hash_to = neighbours[neighbour];
            if (this.move_is_valid(hash_from, hash_to)){
                return true;
            }
        }
        return false;
    };

    this.valid_moves = function(hash_from){
        var neighbours = this.neighbours(hash_from);
        var valid_moves = [];
        for (var neighbour in neighbours){
            var hash_to = neighbours[neighbour];
            if (this.move_is_valid(hash_from, hash_to) === true){
                valid_moves.push(hash_from + " " +  hash_to);
            }
        }
        return valid_moves;
    };

    this.get_turn = function(){
        return private_turn;
    };

    this.get_winner = function(){
        return private_winner;
    };

    this.display_score = function() {
        var score = this.compute_score();
        console.log("\t | J1 | J2 |");
        var sizes = [5, 4, 3, 2];
        for (var i in sizes){
            var j1 = score[sizes[i]][0];
            var j2 = score[sizes[i]][1];
            if (private_winner === false) {
                if (j1 > j2) {
                    private_winner = private_players[0];

                }
                else if (j2 > j1) {
                    private_winner = private_players[1];
                }
            }
            console.log(" " + sizes[i] + " | " + j1 + "  | " + j2 + "  | ");
        }
        if (private_winner === false){
            private_winner = "Nobody";
        }
        console.log(private_winner  + " WON");
    };

    this.compute_score = function(){
        var score = {5: [0, 0], 4: [0, 0], 3: [0, 0], 2: [0, 0]};
        score[5] = private_player_scores;
        for (var c in Lyngk.Columns){
            for (var l in Lyngk.Lines){
                var coord = new Lyngk.Coordinates(Lyngk.Columns[c], Lyngk.Lines[l]);
                if (coord.is_valid() === true){
                    var inter = private_intersections[coord.hash()];
                    if (inter.get_count() < 2){
                        continue;
                    }
                    for(var i in [0, 1]){
                        if(inter.get_color() === private_player_colors[i]){
                            score[inter.get_count()][i] += 1;
                        }
                    }
                }
            }
        }
        return score;
    };


    init();
};
