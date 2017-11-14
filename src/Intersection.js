"use strict";

Lyngk.State = {VACANT: 0, ONE_PIECE: 1, STACK: 2, FULL_STACK: 3};

Lyngk.Intersection = function () {
    var private_pieces;
    var private_states = ["VACANT", "ONE_PIECE", "STACK",
            "STACK", "STACK", "FULL_STACK"];

    var init = function () {
        private_pieces = [];
    };

    this.get_state = function () {
        var length = private_pieces.length;
        return private_states[length];
    };

    this.get_color = function () {
        var positive = this.get_count() > 0;
        if (positive) {
            var color = private_pieces[private_pieces.length - 1].get_color();
            return color;
        }
        return "NONE";
    };

    this.get_count = function () {
        return private_pieces.length;
    };

    this.put = function (piece) {
        if (this.get_state() !== "FULL_STACK") {
            private_pieces.push(piece);
        }
    };

    this.pop = function () {
        return private_pieces.pop();
    };

    this.shift = function () {
        return private_pieces.shift();
    };

    this.flush = function () {
        private_pieces = [];
    };

    this.get_pieces = function () {
        return private_pieces;
    };

    init();
};
