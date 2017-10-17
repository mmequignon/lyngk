'use strict';

var LyngkTestCase = TestCase("LyngkTestCase");

LyngkTestCase.prototype.testStory1 = function() {
    var coordinates = new Lyngk.Coordinates('A', 1);

    assertFalse(coordinates.is_valid());
};

LyngkTestCase.prototype.testStory2 = function() {
    var count = 0;
    for (var l in Lyngk.Lines){
      for (var c in Lyngk.Columns){
          var coords = new Lyngk.Coordinates(Lyngk.Columns[c], Lyngk.Lines[l]);
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

    assertTrue(coordinates.hash() === 653);
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
    for (var l in Lyngk.Lines){
        for (var c in Lyngk.Columns){
            var coordinates = new Lyngk.Coordinates(Lyngk.Columns[c], Lyngk.Lines[l]);
            var hash = coordinates.hash();
            var table_coordinates = table.get_coordinates()[hash];
            if (coordinates.is_valid() === true){
                assertTrue(table_coordinates.get_state() === "ONE_PIECE");
            }
        }
    }
};

LyngkTestCase.prototype.testStory12 = function(){
    var table = new Lyngk.Engine();
    var color_count = {"BLACK": 0, "IVORY": 0, "BLUE": 0, "RED": 0, "GREEN": 0, "WHITE": 0};
    var colors = Object.keys(color_count);
    for (var l in Lyngk.Lines){
        for (var c in Lyngk.Columns){
            var coordinates = new Lyngk.Coordinates(Lyngk.Columns[c], Lyngk.Lines[l]);
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

LyngkTestCase.prototype.testStory13 = function(){
    var table = new Lyngk.Engine();
    for (var l in Lyngk.Lines){
        for (var c in Lyngk.Columns){
            var coordinates = new Lyngk.Coordinates(Lyngk.Columns[c], Lyngk.Lines[l]);
            if (coordinates.is_valid() === true){
                var hash = coordinates.hash();
                var pieces = table.get_coordinates()[hash].get_pieces();
                assertTrue(Array.isArray(pieces) === true);
                assertTrue(pieces.length === 1);
            }
        }
    }
};

LyngkTestCase.prototype.testStory14 = function(){
    var coordinates = new Lyngk.Coordinates("A", 3);
    var blue_piece = new Lyngk.Piece("BLUE");
    coordinates.put(blue_piece);
    var red_piece = new Lyngk.Piece("RED");
    coordinates.put(red_piece);
    var pieces = coordinates.get_pieces();
    var indice = coordinates.get_count() - 1;
    assertTrue(pieces[indice].get_color() === coordinates.get_color());
};

LyngkTestCase.prototype.testStory15 = function(){
    var a3 = new Lyngk.Coordinates("A", 3);
    var b3 = new Lyngk.Coordinates("B", 3);
    var blue_piece = new Lyngk.Piece("BLUE");
    a3.put(blue_piece);
    b3.put(a3.pop());
    assertTrue(a3.get_state() === "VACANT");
    assertTrue(b3.get_color() === blue_piece.get_color());
};

LyngkTestCase.prototype.testStory16 = function(){
    var table = new Lyngk.Engine();
    var b3 = new Lyngk.Coordinates("B", 3);
    var b2 = new Lyngk.Coordinates("B", 2);
    var from_color = table.get_coordinates()[b3.hash()].get_color();
    table.move_stack(b3.hash(), b2.hash());
    assertTrue(table.get_coordinates()[b2.hash()].get_count() === 2);
    assertTrue(table.get_coordinates()[b2.hash()].get_color() === from_color);
    assertTrue(table.get_coordinates()[b3.hash()].get_state() === "VACANT");
};

LyngkTestCase.prototype.testStory17 = function(){
    var table = new Lyngk.Engine();
    var b3 = new Lyngk.Coordinates("B", 3);
    var b2 = new Lyngk.Coordinates("B", 2);
    table.move_stack(b3.hash(), b2.hash());
    var b2_init_color = table.get_coordinates()[b2.hash()].get_color();
    var b2_init_state = table.get_coordinates()[b2.hash()].get_state();
    var b3_init_color = table.get_coordinates()[b3.hash()].get_color();
    var b3_init_state = table.get_coordinates()[b3.hash()].get_state();
    table.move_stack(b2.hash(), b3.hash());
    assertTrue(( (b2_init_color === table.get_coordinates()[b2.hash()].get_color()) &&
                 (b2_init_state === table.get_coordinates()[b2.hash()].get_state()) &&
                 (b3_init_color === table.get_coordinates()[b3.hash()].get_color()) &&
                 (b3_init_state === table.get_coordinates()[b3.hash()].get_state())));
};

LyngkTestCase.prototype.testStory18 = function(){
    var table = new Lyngk.Engine();
    var b3 = new Lyngk.Coordinates("B", 3);
    var c1 = new Lyngk.Coordinates("C", 1);
    var c1_init_color = table.get_coordinates()[c1.hash()].get_color();
    var c1_init_state = table.get_coordinates()[c1.hash()].get_state();
    var b3_init_color = table.get_coordinates()[b3.hash()].get_color();
    var b3_init_state = table.get_coordinates()[b3.hash()].get_state();
    table.move_stack(b3.hash(), c1.hash());
    // Invalid move
    assertTrue(( (c1_init_color === table.get_coordinates()[c1.hash()].get_color()) &&
                 (c1_init_state === table.get_coordinates()[c1.hash()].get_state()) &&
                 (b3_init_color === table.get_coordinates()[b3.hash()].get_color()) &&
                 (b3_init_state === table.get_coordinates()[b3.hash()].get_state())));
    var b2 = new Lyngk.Coordinates("B", 2);
    var b2_init_color = table.get_coordinates()[b2.hash()].get_color();
    var b2_init_state = table.get_coordinates()[b2.hash()].get_state();
    table.move_stack(b3.hash(), b2.hash());
    // Valid moves
    assertFalse(( (b2_init_color === table.get_coordinates()[b2.hash()].get_color()) &&
                  (b2_init_state === table.get_coordinates()[b2.hash()].get_state()) &&
                  (b3_init_color === table.get_coordinates()[b3.hash()].get_color()) &&
                  (b3_init_state === table.get_coordinates()[b3.hash()].get_state())));
    var c2 = new Lyngk.Coordinates("C", 2);
    b2_init_color = table.get_coordinates()[b2.hash()].get_color();
    b2_init_state = table.get_coordinates()[b2.hash()].get_state();
    var c2_init_color = table.get_coordinates()[c2.hash()].get_color();
    var c2_init_state = table.get_coordinates()[c2.hash()].get_state();
    table.move_stack(b2.hash(), c2.hash());
    assertFalse(( (b2_init_color === table.get_coordinates()[b2.hash()].get_color()) &&
                  (b2_init_state === table.get_coordinates()[b2.hash()].get_state()) &&
                  (c2_init_color === table.get_coordinates()[c2.hash()].get_color()) &&
                  (c2_init_state === table.get_coordinates()[c2.hash()].get_state())));
};

LyngkTestCase.prototype.testStory19 = function(){
    var table = new Lyngk.Engine();
    var h8 = new Lyngk.Coordinates("H", 8);
    var h7 = new Lyngk.Coordinates("H", 7);
    var h6 = new Lyngk.Coordinates("H", 6);
    var h5 = new Lyngk.Coordinates("H", 5);
    table.move_stack(h7.hash(), h6.hash());
    table.move_stack(h6.hash(), h5.hash());
    var h5_init_color = table.get_coordinates()[h5.hash()].get_color();
    var h5_init_state = table.get_coordinates()[h5.hash()].get_state();
    var h8_init_color = table.get_coordinates()[h8.hash()].get_color();
    var h8_init_state = table.get_coordinates()[h8.hash()].get_state();
    table.move_stack(h5.hash(), h8.hash());
    assertTrue(( (h5_init_color === table.get_coordinates()[h5.hash()].get_color()) &&
                 (h5_init_state === table.get_coordinates()[h5.hash()].get_state()) &&
                 (h8_init_color === table.get_coordinates()[h8.hash()].get_color()) &&
                 (h8_init_state === table.get_coordinates()[h8.hash()].get_state()) ));
};

LyngkTestCase.prototype.testStory20 = function(){
    var table = new Lyngk.Engine();
    var c1 = new Lyngk.Coordinates("C", 1);
    var c2 = new Lyngk.Coordinates("C", 2);
    var c3 = new Lyngk.Coordinates("C", 3);
    var c4 = new Lyngk.Coordinates("C", 4);
    var c5 = new Lyngk.Coordinates("C", 5);
    var c6 = new Lyngk.Coordinates("C", 6);
    table.move_stack(c1.hash(), c2.hash());
    table.move_stack(c2.hash(), c3.hash());
    table.move_stack(c3.hash(), c4.hash());
    table.move_stack(c4.hash(), c5.hash());
    var c5_init_color = table.get_coordinates()[c5.hash()].get_color();
    var c5_init_state = table.get_coordinates()[c5.hash()].get_state();
    var c6_init_color = table.get_coordinates()[c6.hash()].get_color();
    var c6_init_state = table.get_coordinates()[c6.hash()].get_state();
    table.move_stack(c5.hash(), c6.hash());
    assertTrue(( (c5_init_color === table.get_coordinates()[c5.hash()].get_color()) &&
                 (c5_init_state === table.get_coordinates()[c5.hash()].get_state()) &&
                 (c6_init_color === table.get_coordinates()[c6.hash()].get_color()) &&
                 (c6_init_state === table.get_coordinates()[c6.hash()].get_state()) ));
};

LyngkTestCase.prototype.testStory21 = function() {
    var table = new Lyngk.Engine();
    var c1 = new Lyngk.Coordinates("C", 1);
    var c2 = new Lyngk.Coordinates("C", 2);
    var c3 = new Lyngk.Coordinates("C", 3);
    table.move_stack(c1.hash(), c2.hash());
    var c2_init_color = table.get_coordinates()[c2.hash()].get_color();
    var c2_init_state = table.get_coordinates()[c2.hash()].get_state();
    var c3_init_color = table.get_coordinates()[c3.hash()].get_color();
    var c3_init_state = table.get_coordinates()[c3.hash()].get_state();
    table.move_stack(c3.hash(), c2.hash());
    assertTrue(( (c2_init_color === table.get_coordinates()[c2.hash()].get_color()) &&
        (c2_init_state === table.get_coordinates()[c2.hash()].get_state()) &&
        (c3_init_color === table.get_coordinates()[c3.hash()].get_color()) &&
        (c3_init_state === table.get_coordinates()[c3.hash()].get_state()) ));
};