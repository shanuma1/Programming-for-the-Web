/** return elements of arr grouped in arrays of size g; last element
 *  can contain remaining elements.
 */
/*
> collect([], 3)
[]
> collect([3, 2, 5, 2, 6, 33, 11], 3)
[ [ 3, 2, 5 ], [ 2, 6, 33 ], [ 11 ] ]
> collect([3, 2, 5, 2, 6, 33, 11], 2)
[ [ 3, 2 ], [ 5, 2 ], [ 6, 33 ], [ 11 ] ]
> collect([3, 2, 5, 2, 6, ], 1)
[ [ 3 ], [ 2 ], [ 5 ], [ 2 ], [ 6 ] ]
> collect('hello world'.split(''), 3)
[
  [ 'h', 'e', 'l' ],
  [ 'l', 'o', ' ' ],
  [ 'w', 'o', 'r' ],
  [ 'l', 'd' ]
]
> 
*/

//does not meet hw1 restrictions
function collectIter(arr, g) {
  const ret = [];
  let current = [];
  for (const e of arr) {
    current.push(e);
    if (current.length === g) {
      ret.push(current);
      current = [];
    }
  }
  if (current.length > 0) ret.push(current);
  return ret;
}

//does not meet hw1 restrictions
function collectIter2(arr, g) {
  if (arr.length === 0) {
    return [];
  }
  else {
    const ret = [ [arr[0]] ];
    for (const e of arr.slice(1)) {
      const last = ret.slice(-1)[0];
      if (last.length === g) {
	ret.push([e]);
      }
      else {
	last.push(e);
      }
    }
    return ret;
  }
}

//meets hw1 restrictions
function collect(arr, g) {
  if (arr.length === 0) {
    return [];
  }
  else {
    const add = (acc, e) => {
      const last = acc.slice(-1)[0];
      if (last.length === g) {
	return acc.concat([[e]]);
      }
      else {
	return acc.slice(0, -1).concat([last.concat(e)]);
      }
    };
    return arr.slice(1).reduce(add, [ [ arr[0] ] ]);
  }
}
