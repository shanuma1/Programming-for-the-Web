/** Return list of numbers in [start, end) with increment inc */
/*
> range(2, 10)
[
  2, 3, 4, 5,
  6, 7, 8, 9
]
> range(2, 10, 2)
[ 2, 4, 6, 8 ]
> range(2, 11, 2)
[ 2, 4, 6, 8, 10 ]
> range(2, 11, 3)
[ 2, 5, 8 ]
> range(2, 12, 3)
[ 2, 5, 8, 11 ]
> range(2, 12, 2)
[ 2, 4, 6, 8, 10 ]
> range(-4, 6, 3)
[ -4, -1, 2, 5 ]
*/

//does not meet hw1 restrictions
function rangeIter(start, end, inc=1) {
  let result = [];
  for (let i = start; i < end; i += inc) {
    result.push(i);
  }
  return result;
}

//meets hw1 restrictions
function range(start, end, inc=1) {
  const nRet = Math.trunc((end - start)/inc) + ((end - start)%inc > 0 ? 1 : 0);
  return Array.from({ length: nRet}).map((_, i) => start + i*inc);
}

