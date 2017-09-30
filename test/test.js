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

LyngkTestCase.prototype.testStory2 = function() {
    var coordinates = new Lyngk.Coordinates('A', 3);

    assertTrue((coordinates.representation() === "A3") && (typeof coordinates.representation() === 'string'));
};

LyngkTestCase.prototype.testStory3 = function() {
    var coordinates = new Lyngk.Coordinates('A', 1);

    assertTrue(coordinates.representation() === "invalid");
};

LyngkTestCase.prototype.testStory4 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    var coordinates_copy = coordinates.clone();
    
    assertTrue(coordinates.representation() === coordinates_copy.representation());
};

LyngkTestCase.prototype.testStory5 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);

    assertTrue(coordinates.hash() === 68);
};

LyngkTestCase.prototype.testStory6 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);

    assertTrue(coordinates.get_state() === "VACANT");
};

LyngkTestCase.prototype.testStory7 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    var piece = new Lyngk.Piece("blue");

    coordinates.put(piece);

    assertTrue((coordinates.get_color() === piece.get_color()) && (coordinates.get_state() === "ONE_PIECE"));
};

LyngkTestCase.prototype.testStory8 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    var blue_piece = new Lyngk.Piece("blue");
    var red_piece = new Lyngk.Piece("red");

    coordinates.put(blue_piece);
    coordinates.put(red_piece);

    assertTrue((coordinates.get_color() === red_piece.get_color()) && (coordinates.get_state() === "STACK"));
};

LyngkTestCase.prototype.testStory9 = function() {
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