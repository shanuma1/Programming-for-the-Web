complexFns = {
  toString: function() {
    return `${this.x} + ${this.y}i`
  },
  magnitude: function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }
}

//.1.
//use complexFns as prototype for c1
const c1 = Object.create(complexFns);  
c1.x = 1; c1.y = 1;

//use complexFns as prototype for c2
const c2 = Object.create(complexFns);
c2.x = 3; c2.y = 4;

console.log(`${c1.toString()}: ${c1.magnitude()}`);
console.log(`${c2.toString()}: ${c2.magnitude()}`);
