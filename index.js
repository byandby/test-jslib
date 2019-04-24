(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['test-jslib'] = factory());
}(this, function () { 'use strict';

  var foo = 'hello world!';

  var version = "0.0.4";

  function main () {
    console.log(foo + version);
    console.log('in watching mode again');
  }

  return main;

}));
