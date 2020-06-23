#!/usr/bin/env nodejs

//.1.
const C = 42;

class C {
  static get constant() { return C; }
}

console.log(C.constant);
