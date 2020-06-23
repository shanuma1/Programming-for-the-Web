#!/usr/bin/env nodejs

//.1.
class Shape {
  constructor(x, y) {
    this.x = x; this.y = y;
  }

  //possibly poor design
  static distance(s1, s2) {
    const xDiff = s1.x - s2.x;
    const yDiff = s1.y - s2.y;
    return Math.sqrt(xDiff*xDiff + yDiff*yDiff);
  }
}

//.2.
class Rect extends Shape {
  constructor(x, y, w, h) {
    super(x, y);
    this.width = w; this.height = h;
  }
  area() { return this.width*this.height; }
}

class Circle extends Shape {
  constructor(x, y, r) {
    super(x, y);
    this.radius = r;
  }
  area() { return Math.PI*this.radius*this.radius; }
}

//.3.
const shapes = [
  new Rect(3, 4, 5, 6),
  new Circle(0, 0, 1),
];

shapes.forEach((s) => console.log(s.x, s.y, s.area()));

console.log(Shape.distance(shapes[0], shapes[1]));

