'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-04-14 21:47:44 umrigar>';

const {Question, Rand, emacsTimestampToMillis} = require('gen-q-and-a');

class Prototypes extends Question {

  constructor(params) {
    super(params);
    this.addParamSpec(PARAMS);
    this.addQuestion(QUESTION);
    this.freeze();
    this.addAnswer(ANSWER);
    this.makeContent();
  }

}

module.exports = Prototypes
Object.assign(Prototypes, {
  id: 'prototypes',
  title: 'Prototypes',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

//hackery: question should allow a function
const QUESTION = `
What will be the output of the following program.

~~~
function C1(a) {
  this.a = a;
}
C1.prototype.f = function f(a) { return a + this.a; }

c1 = new C1(#{c1});

function C2(a) { this.a = a; }
C2.prototype.f = function f(a) { return a * this.a; }

c2 = new C2(#{c2});

console.log(c1.f(#{f1}) + c2.f(#{f2}));

Object.setPrototypeOf(c2, c1);

console.log(c1.f(#{f1}) + c2.f(#{f2}));

~~~

You *must* explain your answer. "15-points"
`;

const ANSWER = `
The values printed will be #{answer}.

#{explain1}

#{explain2}
`;

function explain1(c1, c2, f1, f2) {
  return `
   The output of the first \`console.log()\` statement is
   straight-forward.  The first subexpression has \`f()\` invoked on
   \`c1\`, which is created by \`C1\` with instance variable \`a\` set
   to #{c1}.  Hence \`c1.f(#{f1})\` returns \`${c1} + ${c2} = ${c1 +
   f1}\`.  Similarly, the second subexpression has \`f()\` invoked on
   \`c2\`, which is created by \`C2\` with instance variable \`a\` set
   to #{c2}.  Hence \`c2.f(#{f2})\` returns \`${c2} * ${f2} = ${c2 *
   f2}\`.  Hence the output will be \`${c1 + f1} + ${c2 * f2} = ${c1 +
   f1 + c2 * f2}\`.
  `;
}

function explain2(c1, c2, f1, f2) {
  return `
   The output of the second \`console.log()\` statement is slightly
   less straight-forward.  The first subexpression works identically
   to the previous \`console.log()\` statement returning ${c1 + f1}.
   However, the operation of the second operation is different since
   the prototype of \`c2\` has been changed to \`c1\`.  Hence the
   \`f()\` refers to that defined in \`c1\`, namely
   \`C1.prototype.f()\`, which does addition.  However, the value
   which is used for the instance variable \`this.a\` remains that
   defined within \`c2\`, namely ${c2}.  Hence the result of the
   second subexpression will be \`${f2} + ${c2} = ${f2 + c2}\`.  Hence
   the output will be \`${c1 + f1} + ${f2 + c2} = ${c1 + f1 + f2 +
   c2}\`.
  `;
}

function compute1(c1, c2, f1, f2) {
  function C1(a) {
    this.a = a;
  }
  C1.prototype.f = function f(a) { return a + this.a; }

  c1 = new C1(c1);

  function C2(a) { this.a = a; }
  C2.prototype.f = function f(a) { return a * this.a; }

  c2 = new C2(c2);

  const a1 = c1.f(f1) + c2.f(f2);

  Object.setPrototypeOf(c2, c1);

  const a2 = c1.f(f1) + c2.f(f2);
  return [a1, a2];
}

const PARAMS = [
  { c1: () => Rand.int(2, 12),
    c2: () => Rand.int(2, 10),
    f1: () => Rand.int(2, 15),
    f2: () => Rand.int(2, 10),
  },
  { _type: 'nonRandom',
    answer: ({c1, c2, f1, f2}) => compute1(c1, c2, f1, f2).join(' and '),
    explain1: ({c1, c2, f1, f2}) => explain1(c1, c2, f1, f2),
    explain2: ({c1, c2, f1, f2}) => explain2(c1, c2, f1, f2),
  },
];

if (process.argv[1] === __filename) {
  console.log(new Prototypes().qaText());
}
