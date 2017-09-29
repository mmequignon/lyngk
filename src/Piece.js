"use strict";

Lyngk.Piece = function (c) {
    var private_color;

    var init = function(c){
        private_color = c;
    }

    this.get_color = function() {
        return private_color;
    };

    init(c);
};
