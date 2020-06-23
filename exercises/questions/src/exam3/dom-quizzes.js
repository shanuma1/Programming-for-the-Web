'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-05-11 11:32:34 umrigar>';

const {Question, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class DomQuizzes extends Question {

  constructor(params) {
    super(params);
    this.freeze();
    const question = makeQuestion();
    this.addQuestion(question);
    this.addAnswer(explain());
    this.makeContent();
  }
  
}

module.exports = DomQuizzes;
Object.assign(DomQuizzes, {
  id: 'domQuizzes',
  title: 'DomQuizzes',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const POINTS = 15;


function makeQuestion() {
  let text = '';
  text += `
    Given the following HTML representation of quiz grades:

    .code(lang=html)

    ~~~
    <table class="quizzes">
      <tr>
        <th>Student Name</th>
	<th>Quiz 1</th>
	<th>Quiz 2</th>
	...
	<th>Quiz 6</th>
      </tr>
      <tr class="student">
        <td class="name">Ben Bitdiddle</td>
	<td class="grade quiz1">65</td>
	...
	<td class="grade quiz6">65</td>
      </tr>
      ...
      <tr class="student">
        <td class="name">Alyss P. Hacker</td>
	<td class="grade quiz1">100</td>
	...
	<td class="grade quiz6">98</td>
      </tr>
      ...
    </table>
    ~~~

    Using either jquery or DOM primitives, write an \`averageGrade()\`
    function which takes a single argument which is a string like
    \`"quiz1"\` or \`"quiz6"\` and returns the average grade obtained for
    the specified quiz.

    *Your answer may not use any explicit JavaScript loops.*
     "${POINTS}-points"

  `;
  return text;
}

function explain(params) {
  let text = '';
  text += `
    Use a DOM or jQuery selector to extract the grades into an array
    and then simply \`reduce()\` the array to its sum.

    Using the DOM:

    ~~~
    function averageGrade(assgn) {
      const selector = \`.grades .student \${assgn}\`;
      const grades = document.querySelectorAll(selector);
      const sum =
        grades.reduce((s, e) => s + new Number(e.innerHTML),
	              0);
      return grades.length > 0 ? sum/grades.length : 0;
    }
    ~~~

    Using jquery:

    ~~~
    function averageGrade(assgn) {
      const selector = \`.grades .student \${assgn}\`;
      const grades = $(selector).toArray();
      const sum =
        grades.reduce((s, e) => s + new Number(e.innerHTML),
	              0);
      return grades.length > 0 ? sum/grades.length : 0;
    }
    ~~~

  `;
  return text;
}


if (process.argv[1] === __filename) {
  console.log(new DomQuizzes().qaText());
}
