function makeSeq(lo, hi, inc=1) {
  return {
    [Symbol.iterator]() { //fn property syntax
      let value = lo;
      return {
	next() {
	  const obj = { done: value > hi, value };
	  value += inc;
	  return obj;
	},
      };
    },
  };
}
//.1.

for (const v of makeSeq(3, 5)) { console.log(v); }
for (const v of makeSeq(3, 10, 2)) { console.log(v); }

for (const i of makeSeq(1, 2)) { //nested seq obj lifetimes
  for (const j of makeSeq(3, 4)) {
    console.log(i, j);
  }
}
