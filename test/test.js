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

LyngkTestCase.prototype.testStory2 = function() {
    var coordinates = new Lyngk.Coordinates('A', 1);

    assertTrue(coordinates.representation() === "invalid");
};