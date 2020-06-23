const c1 = {
  x: 1,
  y: 1,
  toString: function() {
    return `${this.x} + ${this.y}i`
  },
  magnitude: function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
}

//.1.
const c2 = {
  x: 3,
  y: 4,
  toString: function() {
    return `${this.x} + ${this.y}i`
  },
  magnitude: function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
}

console.log(`${c1.toString()}: ${c1.magnitude()}`);
console.log(`${c2.toString()}: ${c2.magnitude()}`);
