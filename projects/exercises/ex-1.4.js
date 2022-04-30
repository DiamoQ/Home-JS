function createCounter(n) {
   return function() {
      console.log(++n);
   }
}
var fn = createCounter(10);
fn();