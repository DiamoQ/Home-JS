function f1(a, b) {
  var result = a + b + sum;

  return result;
};

function f2(c, d){
  var sum = c + d;

  return sum;
};

var sum = f2(1, 7);
var result = f1(12, 42);
console.log(result);