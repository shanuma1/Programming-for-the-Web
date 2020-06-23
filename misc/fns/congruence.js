/** Given array arr of non-negative integers and a positive integer m,
 *  return m-element array ret such that ret[i] is a list containing
 *  those elements e of arr[] such that e%m === i
 */
/*
> congruence([3, 2, 5, 2, 6, 7], 3)
[ [ 3, 6 ], [ 7 ], [ 2, 5, 2 ] ]
> congruence([3, 2, 5, 2, 6, 7], 2)
[ [ 2, 2, 6 ], [ 3, 5, 7 ] ]
> congruence([], 2)
[ [], [] ]
> 
*/

//does not meet hw1 restrictions
function congruenceIter(arr, m) {
  const ret = Array.from({length: m}).map(_ => []);
  for (const e of arr) {
    ret[e%m].push(e);
  }
  return ret;
}

//meets hw1 restrictions
function congruence(arr, m) {
  return Array.from({length: m}).
    map(_ => []).
    map((_, i) => arr.filter(e => e%m === i));
}
