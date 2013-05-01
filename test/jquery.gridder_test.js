/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */

  function assertSize(elm, width, height) {
    var coords = elm.coords().grid;

    QUnit.push(coords.size_x == width, coords.size_x,  width,  "Width");
    QUnit.push(coords.size_y == height, coords.size_y, height, "Height");
  }

  function assertPos(elm, row, col) {
    var coords = elm.coords().grid;

    QUnit.push(coords.row == row, coords.row, row, "Row");
    QUnit.push(coords.col == col, coords.col, col, "Col");
  }

  module('jQuery#gridster', {
    setup: function() {
      this.gridsterFromFixture = function(fixtureNo, options) {
        options = options || {};

        return $("#qunit-fixture").find("#fixture-"+fixtureNo+" ul").gridster($.extend({
          widget_base_dimensions: [10, 10],
          widget_margins: [1, 1],
        }, options)).data("gridster");
      }
    }
  });

  test("max_cols option", function() {
    var g = this.gridsterFromFixture(1, { max_cols: 2 });
    equal(g.cols, 2);
  });

  test("max_rows option", function() {
    var g = this.gridsterFromFixture(1, { max_rows: 2 });
    equal(g.rows, 2);
  });

  test("resize", function() {
    var g = this.gridsterFromFixture(1);
    var widget = g.$el.find("li");
    g.resize_widget(widget, 2, 3);
    assertSize(widget, 2, 3);
    assertPos(widget, 1, 1);
  });

  test("widening a widget should not add unnecessary extra cols", function() {
    var g = this.gridsterFromFixture(1);
    var colsBefore = g.cols;
    var widget = g.$el.find("li[data-row=1]");
    g.resize_widget(widget, 2, 1);
    equal(g.cols, colsBefore);
  });

  test("heightening a widget should not add unnecessary extra rows", function() {
    var g = this.gridsterFromFixture(1);
    var rowsBefore = g.rows;
    var widget = g.$el.find("li[data-row=1]");
    g.resize_widget(widget, 1, 2);
    equal(g.rows, rowsBefore);
  });

  test("shrinking a widget should allow moving up", function() {
    var g = this.gridsterFromFixture(2);
    var widget = g.$el.find("li[data-row=2]");
    g.resize_widget(widget, 1, 1);

    assertSize(widget, 1, 1);
    assertPos(widget, 1, 1);
  });

  asyncTest("drag", function() {
    var g = this.gridsterFromFixture(2);
    var widget = g.$el.find("li[data-row=2]");
    Syn.drag("+15 +0", widget, function() {
      assertPos(widget, 2, 1);
      start();
    });
  });

  asyncTest("expanding a widget should preserve integrity of gridmap", function() {
    var g = this.gridsterFromFixture(3, { max_rows: 2, max_cols: 2 });
    var lower = g.$el.find("li[data-row=1]");
    var upper = g.$el.find("li[data-row=2]");

    g.resize_widget(lower, 2, 1);

    Syn.drag("+15 +0", upper, function() {
      assertPos(upper, 2, 2);
      start();
    });
  });

}(jQuery));
