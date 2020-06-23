Function.prototype.method = function (name, func) {
 if (!this.prototype[name]) {
   this.prototype[name] = func;
 }};

//.1.
function Complex(x, y) {
  this.x = x;
  this.y = y;
}

Complex.method('toStr', function() {
  return `${this.x} + ${this.y}i`
});
Complex.method('magnitude', function() {
  return Math.sqrt(this.x*this.x + this.y*this.y);
});

const c1 = new Complex(1, 1);
const c2 = new Complex(3, 4);
console.log(`${c1.toStr()}: ${c1.magnitude()}`);
console.log(`${c2.toStr()}: ${c2.magnitude()}`);



