'use strict';

var LyngkTestCase = TestCase("LyngkTestCase");

LyngkTestCase.prototype.testStory1 = function() {
    var coordinates = new Lyngk.Coordinates('A', 1);

    assertFalse(coordinates.is_valid());
};

LyngkTestCase.prototype.testStory2 = function() {
    var count = 0;
    var lines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

    for (var l in lines){
      for (var r in rows){
          var coords = new Lyngk.Coordinates(rows[r], lines[l]);
          if ( coords.is_valid() === true ){
              count++;
          }
      }
    }

    assertTrue((count === 43));
};

LyngkTestCase.prototype.testStory3 = function() {
    var coordinates = new Lyngk.Coordinates('A', 3);

    assertTrue((coordinates.representation() === "A3") && (typeof coordinates.representation() === 'string'));
};

LyngkTestCase.prototype.testStory4 = function() {
    var coordinates = new Lyngk.Coordinates('A', 1);

    assertTrue(coordinates.representation() === "invalid");
};

LyngkTestCase.prototype.testStory5 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    var coordinates_copy = coordinates.clone();
    
    assertTrue(coordinates.representation() === coordinates_copy.representation());
};

LyngkTestCase.prototype.testStory6 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);

    assertTrue(coordinates.hash() === 68);
};

LyngkTestCase.prototype.testStory7 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);

    assertTrue(coordinates.get_state() === "VACANT");
};

LyngkTestCase.prototype.testStory8 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    var piece = new Lyngk.Piece("blue");

    coordinates.put(piece);

    assertTrue((coordinates.get_color() === piece.get_color()) && (coordinates.get_state() === "ONE_PIECE"));
};

LyngkTestCase.prototype.testStory9 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    var blue_piece = new Lyngk.Piece("blue");
    var red_piece = new Lyngk.Piece("red");

    coordinates.put(blue_piece);
    coordinates.put(red_piece);

    assertTrue((coordinates.get_color() === red_piece.get_color()) && (coordinates.get_state() === "STACK"));
};

LyngkTestCase.prototype.testStory10 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    var blue_piece = new Lyngk.Piece("blue");
    for (var i = 0; i < 5; i++){
        coordinates.put(blue_piece);
        if (i === 0){
            assertTrue(coordinates.get_state() === "ONE_PIECE");
        } else if (i < 4) {
            assertTrue(coordinates.get_state() === "STACK");
        } else if (i === 4){
            assertTrue(coordinates.get_state() === "FULL_STACK");
        }
    }
};

LyngkTestCase.prototype.testStory11 = function() {
    var table = new Lyngk.Engine();
    var lines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    for (var r in rows){
        for (var l in lines){
            var coordinates = new Lyngk.Coordinates(rows[r], lines[l]);
            var hash = coordinates.hash();
            var table_coordinates = table.get_coordinates()[hash];
            if (coordinates.is_valid() == true){
                assertTrue(table_coordinates.get_state() === "ONE_PIECE");
            }
        }
    }
};

LyngkTestCase.prototype.testStory12 = function(){
    var table = new Lyngk.Engine();
    var color_count = {"BLACK": 0, "IVORY": 0, "BLUE": 0, "RED": 0, "GREEN": 0, "WHITE": 0};
    var colors = Object.keys(color_count);
    var lines = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    var rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
    for (var r in rows){
        for (var l in lines){
            var coordinates = new Lyngk.Coordinates(rows[r], lines[l]);
            if (coordinates.is_valid() === true){
                var hash = coordinates.hash();
                var table_coordinates = table.get_coordinates()[hash];
                color_count[table_coordinates.get_color()] += 1;
            }
        }
    }
    for (var color in color_count) {
        if (colors.indexOf(color) > -1 ) {
            if (color === "WHITE") {
                assertTrue(color_count[color] === 3);
            }
            else {
                assertTrue(color_count[color] === 8);
            }
        }
        else {
            assertTrue(false);
        }
    }
};