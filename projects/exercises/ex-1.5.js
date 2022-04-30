function f() {
  var result = Array.from(arguments);

  return result
}

var result = f(1, 2, 3, 5, 12, 22);

console.log(result);