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
    var intersection = new Lyngk.Intersection(coordinates);

    assertTrue(intersection.get_state() === "VACANT");
};

LyngkTestCase.prototype.testStory8 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    var intersection = new Lyngk.Intersection(coordinates);
    var piece = new Lyngk.Piece("blue");

    intersection.put(piece);

    assertTrue((intersection.get_color() === piece.get_color()) && (intersection.get_state() === "ONE_PIECE"));
};

LyngkTestCase.prototype.testStory9 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    var intersection = new Lyngk.Intersection(coordinates);
    var blue_piece = new Lyngk.Piece("blue");
    var red_piece = new Lyngk.Piece("red");

    intersection.put(blue_piece);
    intersection.put(red_piece);

    assertTrue((intersection.get_color() === red_piece.get_color()) && (intersection.get_state() === "STACK"));
};

LyngkTestCase.prototype.testStory10 = function() {
    var coordinates = new Lyngk.Coordinates("A", 3);
    var intersection = new Lyngk.Intersection(coordinates);
    var blue_piece = new Lyngk.Piece("blue");
    for (var i = 0; i < 5; i++){
        intersection.put(blue_piece);
        if (i === 0){
            assertTrue(intersection.get_state() === "ONE_PIECE");
        } else if (i < 4) {
            assertTrue(intersection.get_state() === "STACK");
        } else if (i === 4){
            assertTrue(intersection.get_state() === "FULL_STACK");
        }
    }
};

LyngkTestCase.prototype.testStory11 = function() {
    var table = new Lyngk.Engine();
    for (var l in Lyngk.Lines){
        for (var c in Lyngk.Columns){
            var coordinates = new Lyngk.Coordinates(Lyngk.Columns[c], Lyngk.Lines[l]);
            var hash = coordinates.hash();
            var intersection = table.get_intersections()[hash];
            if (coordinates.is_valid() === true){
                assertTrue(intersection.get_state() === "ONE_PIECE");
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
                var intersection = table.get_intersections()[hash];
                color_count[intersection.get_color()] += 1;
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
                var pieces = table.get_intersections()[hash].get_pieces();
                assertTrue(Array.isArray(pieces) === true);
                assertTrue(pieces.length === 1);
            }
        }
    }
};

LyngkTestCase.prototype.testStory14 = function(){
    var table = new Lyngk.Engine();
    for (var l in Lyngk.Lines){
        for (var c in Lyngk.Columns){
            var coordinates = new Lyngk.Coordinates(Lyngk.Columns[c], Lyngk.Lines[l]);
            if (coordinates.is_valid() === true){
                var hash = coordinates.hash();
                var intersection = table.get_intersections()[hash];
                var pieces = intersection.get_pieces();
                var indice = intersection.get_count() - 1;
                assertTrue(pieces[indice].get_color() === intersection.get_color());
            }
        }
    }


};

LyngkTestCase.prototype.testStory15 = function(){
    var a3 = new Lyngk.Intersection(new Lyngk.Coordinates("A", 3));
    var b3 = new Lyngk.Intersection(new Lyngk.Coordinates("B", 3));
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
    var from_color = table.get_intersections()[b3.hash()].get_color();
    table.move_stack(b3.hash(), b2.hash());
    assertTrue(table.get_intersections()[b2.hash()].get_count() === 2);
    assertTrue(table.get_intersections()[b2.hash()].get_color() === from_color);
    assertTrue(table.get_intersections()[b3.hash()].get_state() === "VACANT");
};

LyngkTestCase.prototype.testStory17 = function(){
    var table = new Lyngk.Engine();
    var b3 = new Lyngk.Coordinates("B", 3);
    var b2 = new Lyngk.Coordinates("B", 2);
    table.move_stack(b3.hash(), b2.hash());
    var b2_init_color = table.get_intersections()[b2.hash()].get_color();
    var b2_init_state = table.get_intersections()[b2.hash()].get_state();
    var b3_init_color = table.get_intersections()[b3.hash()].get_color();
    var b3_init_state = table.get_intersections()[b3.hash()].get_state();
    table.move_stack(b2.hash(), b3.hash());
    assertTrue(( (b2_init_color === table.get_intersections()[b2.hash()].get_color()) &&
                 (b2_init_state === table.get_intersections()[b2.hash()].get_state()) &&
                 (b3_init_color === table.get_intersections()[b3.hash()].get_color()) &&
                 (b3_init_state === table.get_intersections()[b3.hash()].get_state())));
};

LyngkTestCase.prototype.testStory18 = function(){
    var table = new Lyngk.Engine();
    var b3 = new Lyngk.Coordinates("B", 3);
    var c1 = new Lyngk.Coordinates("C", 1);
    var c1_init_color = table.get_intersections()[c1.hash()].get_color();
    var c1_init_state = table.get_intersections()[c1.hash()].get_state();
    var b3_init_color = table.get_intersections()[b3.hash()].get_color();
    var b3_init_state = table.get_intersections()[b3.hash()].get_state();
    table.move_stack(b3.hash(), c1.hash());
    // Invalid move
    assertTrue(( (c1_init_color === table.get_intersections()[c1.hash()].get_color()) &&
                 (c1_init_state === table.get_intersections()[c1.hash()].get_state()) &&
                 (b3_init_color === table.get_intersections()[b3.hash()].get_color()) &&
                 (b3_init_state === table.get_intersections()[b3.hash()].get_state())));
    var b2 = new Lyngk.Coordinates("B", 2);
    var b2_init_color = table.get_intersections()[b2.hash()].get_color();
    var b2_init_state = table.get_intersections()[b2.hash()].get_state();
    table.move_stack(b3.hash(), b2.hash());
    // Valid moves
    assertFalse(( (b2_init_color === table.get_intersections()[b2.hash()].get_color()) &&
                  (b2_init_state === table.get_intersections()[b2.hash()].get_state()) &&
                  (b3_init_color === table.get_intersections()[b3.hash()].get_color()) &&
                  (b3_init_state === table.get_intersections()[b3.hash()].get_state())));
    var c2 = new Lyngk.Coordinates("C", 2);
    b2_init_color = table.get_intersections()[b2.hash()].get_color();
    b2_init_state = table.get_intersections()[b2.hash()].get_state();
    var c2_init_color = table.get_intersections()[c2.hash()].get_color();
    var c2_init_state = table.get_intersections()[c2.hash()].get_state();
    table.move_stack(b2.hash(), c2.hash());
    assertFalse(( (b2_init_color === table.get_intersections()[b2.hash()].get_color()) &&
                  (b2_init_state === table.get_intersections()[b2.hash()].get_state()) &&
                  (c2_init_color === table.get_intersections()[c2.hash()].get_color()) &&
                  (c2_init_state === table.get_intersections()[c2.hash()].get_state())));
};

LyngkTestCase.prototype.testStory19 = function(){
    var table = new Lyngk.Engine();
    var h8 = new Lyngk.Coordinates("H", 8);
    var h7 = new Lyngk.Coordinates("H", 7);
    var h6 = new Lyngk.Coordinates("H", 6);
    var h5 = new Lyngk.Coordinates("H", 5);
    table.move_stack(h7.hash(), h6.hash());
    table.move_stack(h6.hash(), h5.hash());
    var h5_init_color = table.get_intersections()[h5.hash()].get_color();
    var h5_init_state = table.get_intersections()[h5.hash()].get_state();
    var h8_init_color = table.get_intersections()[h8.hash()].get_color();
    var h8_init_state = table.get_intersections()[h8.hash()].get_state();
    table.move_stack(h5.hash(), h8.hash());
    assertTrue(( (h5_init_color === table.get_intersections()[h5.hash()].get_color()) &&
                 (h5_init_state === table.get_intersections()[h5.hash()].get_state()) &&
                 (h8_init_color === table.get_intersections()[h8.hash()].get_color()) &&
                 (h8_init_state === table.get_intersections()[h8.hash()].get_state()) ));
};

LyngkTestCase.prototype.testStory20 = function(){
    var table = new Lyngk.Engine();
    var d7 = new Lyngk.Coordinates("D", 7);
    var d6 = new Lyngk.Coordinates("D", 6);
    var d5 = new Lyngk.Coordinates("D", 5);
    var d4 = new Lyngk.Coordinates("D", 4);
    var c4 = new Lyngk.Coordinates("C", 4);
    var c3 = new Lyngk.Coordinates("C", 3);
    table.move_stack(d7.hash(), d6.hash());
    table.move_stack(d6.hash(), d5.hash());
    table.move_stack(d5.hash(), d4.hash());
    table.move_stack(d4.hash(), c4.hash());
    var c4_init_color = table.get_intersections()[c4.hash()].get_color();
    var c4_init_state = table.get_intersections()[c4.hash()].get_state();
    var c3_init_color = table.get_intersections()[c3.hash()].get_color();
    var c3_init_state = table.get_intersections()[c3.hash()].get_state();
    table.move_stack(c4.hash(), c3.hash());
    assertTrue(( (c4_init_color === table.get_intersections()[c4.hash()].get_color()) &&
             (c4_init_state === table.get_intersections()[c4.hash()].get_state()) &&
             (c3_init_color === table.get_intersections()[c3.hash()].get_color()) &&
             (c3_init_state === table.get_intersections()[c3.hash()].get_state()) ));
};

LyngkTestCase.prototype.testStory21 = function() {
    var table = new Lyngk.Engine();
    var c1 = new Lyngk.Coordinates("C", 1);
    var c2 = new Lyngk.Coordinates("C", 2);
    var c3 = new Lyngk.Coordinates("C", 3);
    table.move_stack(c1.hash(), c2.hash());
    var c2_init_color = table.get_intersections()[c2.hash()].get_color();
    var c2_init_state = table.get_intersections()[c2.hash()].get_state();
    var c3_init_color = table.get_intersections()[c3.hash()].get_color();
    var c3_init_state = table.get_intersections()[c3.hash()].get_state();
    table.move_stack(c3.hash(), c2.hash());
    assertTrue(( (c2_init_color === table.get_intersections()[c2.hash()].get_color()) &&
        (c2_init_state === table.get_intersections()[c2.hash()].get_state()) &&
        (c3_init_color === table.get_intersections()[c3.hash()].get_color()) &&
        (c3_init_state === table.get_intersections()[c3.hash()].get_state()) ));
};

LyngkTestCase.prototype.testStory22 = function(){
    var table = new Lyngk.Engine();
    var d2 = new Lyngk.Coordinates("D", 2);
    var d3 = new Lyngk.Coordinates("D", 3);
    table.move_stack(d2.hash(), d3.hash());
    var c1 = new Lyngk.Coordinates("C", 1);
    var c2 = new Lyngk.Coordinates("C", 2);
    var c3 = new Lyngk.Coordinates("C", 3);
    table.move_stack(c1.hash(), c2.hash());
    table.move_stack(c2.hash(), c3.hash());
    var d3_init_color = table.get_intersections()[d3.hash()].get_color();
    var d3_init_state = table.get_intersections()[d3.hash()].get_state();
    var c3_init_color = table.get_intersections()[c3.hash()].get_color();
    var c3_init_state = table.get_intersections()[c3.hash()].get_state();
    table.move_stack(d3.hash(), c3.hash());
    assertTrue( (d3_init_color === table.get_intersections()[d3.hash()].get_color()) &&
                (d3_init_state === table.get_intersections()[d3.hash()].get_state()) &&
                (c3_init_color === table.get_intersections()[c3.hash()].get_color()) &&
                (c3_init_state === table.get_intersections()[c3.hash()].get_state()));
};

LyngkTestCase.prototype.testStory23 = function(){
    var table = new Lyngk.Engine();
    var g3 = new Lyngk.Coordinates("G", 3);
    var g4 = new Lyngk.Coordinates("G", 4);
    table.move_stack(g3.hash(), g4.hash());
    var g5 = new Lyngk.Coordinates("G", 5);
    table.move_stack(g4.hash(), g5.hash());
    var g6 = new Lyngk.Coordinates("G", 6);
    table.move_stack(g5.hash(), g6.hash());
    var g7 = new Lyngk.Coordinates("G", 7);
    table.move_stack(g6.hash(), g7.hash());
    assertTrue(table.get_intersections()[g7.hash()].get_count() !== 5);
};

LyngkTestCase.prototype.testStory24 = function(){
    var game = new Lyngk.Game();
    assertTrue(game.get_current_player() === 'Joueur 1');
};