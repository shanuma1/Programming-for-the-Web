function Complex(x, y) {
  this.x = x;
  this.y = y;
}

Complex.prototype.toString = function() {
  return `${this.x} + ${this.y}i`
};
Complex.prototype.magnitude = function() {
  return Math.sqrt(this.x*this.x + this.y*this.y);
};

const c1 = new Complex(1, 1);
const c2 = new Complex(3, 4);

console.log(`${c1.toString()}: ${c1.magnitude()}`);
console.log(`${c2.toString()}: ${c2.magnitude()}`);



