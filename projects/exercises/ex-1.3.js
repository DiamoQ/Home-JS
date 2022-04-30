function fn1(item, b) {

  var result = item + b;

  return result;
};

var result = fn1('возвратит', fn2(' привет'));

console.log(result);

function fn2(i) {
 
  var res = i;

  return res;
};


