"use strict";

// enums definition
Lyngk.Color = {BLACK: 0, IVORY: 1, BLUE: 2, RED: 3, GREEN: 4, WHITE: 5};
Lyngk.Lines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
Lyngk.Columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

Lyngk.Engine = function () {
    var private_intersections = [];
    var private_pieces;
    var private_players = ["Player 1", "Player 2"];
    var private_player_colors = [];
    var private_player_scores = [0, 0];
    var private_turn = 0;
    var private_winner = false;


    var get_random_piece = function () {
        var colors = Object.keys(private_pieces);
        var color = colors[Math.floor(Math.random() * colors.length)];
        private_pieces[color] -= 1;
        if (private_pieces[color] === 0) {
            delete private_pieces[color];
        }
        return new Lyngk.Piece(color);
    };

    var init_pieces = function () {
        return {
            "BLACK": 8,
            "BLUE": 8,
            "IVORY": 8,
            "GREEN": 8,
            "RED": 8,
            "WHITE": 3
        };
    };

    var put_random_piece_if_valid = function (coordinate) {
        if (coordinate.is_valid() === true) {
            var intersection = new Lyngk.Intersection(coordinate);
            var piece = get_random_piece();
            intersection.put(piece);
            var pos = coordinate.hash();
            private_intersections[pos] = intersection;
        }
    };

    var init = function () {
        Math.seedrandom("isidis-i2l");
        private_pieces = init_pieces();
        var l, c, coordinate;
        for (l in Lyngk.Lines) {
            for (c in Lyngk.Columns) {
                coordinate = new Lyngk.Coordinates(
                    Lyngk.Columns[c], Lyngk.Lines[l]
                );
                put_random_piece_if_valid(coordinate);
            }
        }
    };

    this.get_intersections = function () {
        return private_intersections;
    };


    this.move_stack = function (hash_from, hash_to) {
        if (this.move_is_valid(hash_from, hash_to) === true) {
            while (private_intersections[hash_from].get_state() !== "VACANT") {
                private_intersections[hash_to].put(
                    private_intersections[hash_from].shift()
                );
            }
            this.player_get_point(
                hash_to,
                this.get_player_color(private_turn % 2)
            );
            private_turn += 1;
            return true;
        }
        return false;
    };

    this.not_opponent_color_in_stacks = function (hash_from, hash_to) {
        var from_intersection = private_intersections[hash_from];
        var to_intersection = private_intersections[hash_to];
        var opponent_color = private_player_colors[(private_turn + 1) % 2];
        return ((from_intersection.get_color() === opponent_color) ||
                (to_intersection.get_color() === opponent_color)) === false;
    };

    this.is_neighbour = function (hash_from, hash_to) {
        var neighbours = [1, 9, 10];
        return neighbours.indexOf(Math.abs(hash_from - hash_to)) > -1;
    };

    this.target_not_vacant = function (hash_to) {
        return private_intersections[hash_to].get_state() !== "VACANT";
    };

    this.inferior_source = function (hash_from, hash_to) {
        var source_count = private_intersections[hash_from].get_count();
        var destination_count = private_intersections[hash_to].get_count();
        return (source_count - destination_count) > -1;
    };

    this.get_colors = function (hash) {
        var colors = [];
        var pieces = private_intersections[hash].get_pieces();
        var piece;
        for (piece in pieces) {
            colors.push(pieces[piece].get_color());
        }
        return colors;
    };

    this.not_color_double = function (hash_from, hash_to) {
        var from_colors = this.get_colors(hash_from);
        var to_colors = this.get_colors(hash_to);
        var color, color_is_not_white, color_in_stack;
        for (color in from_colors) {
            color_is_not_white = from_colors[color] !== "WHITE";
            color_in_stack = to_colors.indexOf(from_colors[color]);
            if (color_in_stack > -1 && color_is_not_white) {
                return false;
            }
        }
        return true;
    };

    this.stacks_sum_size_is_valid = function (hash_from, hash_to) {
        var source_count = private_intersections[hash_from].get_count();
        var destination_count = private_intersections[hash_to].get_count();
        return (source_count + destination_count <= 5);
    };

    this.not_white_and_first_turn = function (hash_from) {
        return (
            private_turn === 0 &&
            private_intersections[hash_from].get_color() === "WHITE"
        ) === false;
    };

    this.move_is_valid = function (hash_from, hash_to) {
        return (this.is_neighbour(hash_from, hash_to) &&
                this.target_not_vacant(hash_to) &&
                this.stacks_sum_size_is_valid(hash_from, hash_to) &&
                this.inferior_source(hash_from, hash_to) &&
                this.not_opponent_color_in_stacks(hash_from, hash_to) &&
                this.not_color_double(hash_from, hash_to) &&
                this.not_white_and_first_turn(hash_from));
    };

    this.player_get_point = function (hash_to, color) {
        var stack_is_full = (
            private_intersections[hash_to].get_state() === 'FULL_STACK'
        );
        var stack_color = private_intersections[hash_to].get_color();
        var same_color = (stack_color === color || stack_color === "WHITE");
        if (stack_is_full && same_color) {
            private_player_scores[private_turn % 2] += 1;
            private_intersections[hash_to].flush();
        }
    };

    this.get_current_player = function () {
        return private_players[private_turn % 2];
    };

    this.ask_color = function (color) {
        private_player_colors[private_turn % 2] = color;
    };

    this.get_player_color = function (player) {
        return private_player_colors[player];
    };

    this.get_player_score = function (player) {
        return private_player_scores[player];
    };

    this.neighbours = function (hash) {
        var neighbours = [];
        var hashs = [
            hash - 10,
            hash - 9,
            hash - 1,
            hash + 1,
            hash + 9,
            hash + 10
        ];
        var h;
        for (h in hashs) {
            if (private_intersections[hashs[h]] !== undefined) {
                neighbours.push(hashs[h]);
            }
        }
        return neighbours;
    };

    this.is_movable = function (hash_from) {
        var neighbours = this.neighbours(hash_from);
        var neighbour, hash_to;
        for (neighbour in neighbours) {
            hash_to = neighbours[neighbour];
            if (this.move_is_valid(hash_from, hash_to)) {
                return true;
            }
        }
        return false;
    };

    this.valid_moves = function (hash_from) {
        var neighbours = this.neighbours(hash_from);
        var valid_moves = [];
        var neighbour, hash_to;
        for (neighbour in neighbours) {
            hash_to = neighbours[neighbour];
            if (this.move_is_valid(hash_from, hash_to) === true) {
                valid_moves.push(hash_from + " " + hash_to);
            }
        }
        return valid_moves;
    };

    this.get_turn = function () {
        return private_turn;
    };

    this.get_winner = function () {
        return private_winner;
    };

    var display_line = function (size, j1, j2) {
        if (private_winner === false && j1 !== j2) {
            if (j1 > j2) {
                private_winner = private_players[0];

            } else {
                private_winner = private_players[1];
            }
        }
        console.log(" " + size + " | " + j1 + "  | " + j2 + "  | ");
    };

    this.display_score = function () {
        var score = this.compute_score();
        console.log("\t | J1 | J2 |");
        var size, j1, j2;
        for (size = 5; size > 1; size--) {
            j1 = score[size][0];
            j2 = score[size][1];
            display_line(size, j1, j2);
        }
        if (private_winner === false) {
            private_winner = "Nobody";
        }
        console.log(private_winner + " WON");
    };

    this.compute_coordinate = function (coordinate, score) {
        if (coordinate.is_valid() === true) {
            var intersection = private_intersections[coordinate.hash()];
            var player = private_player_colors.indexOf(
                intersection.get_color()
            );
            if (intersection.get_count() > 1 && player > -1) {
                score[intersection.get_count()][player] += 1;
            }
        }
    };

    this.compute_table = function () {
        var score = {'5': [0, 0], '4': [0, 0], '3': [0, 0], '2': [0, 0]};
        score[5] = private_player_scores;
        var c, l, coordinate;
        for (c in Lyngk.Columns) {
            for (l in Lyngk.Lines) {
                coordinate = new Lyngk.Coordinates(
                    Lyngk.Columns[c], Lyngk.Lines[l]
                );
                this.compute_coordinate(coordinate, score);
            }
        }
        return score;
    };

    this.declare_winner = function (j1, j2) {
        if (j1 > j2) {
            private_winner = private_players[0];
        } else {
            private_winner = private_players[1];
        }
    };

    this.compute_score = function () {
        var score = this.compute_table();
        var size;
        for (size = 5; size > 1; size--) {
            if (private_winner === false && score[size][0] !== score[size][1]) {
                this.declare_winner(score[size][0] !== score[size][1]);
            }
        }
        return score;
    };


    init();
};
