'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-05-11 10:43:23 umrigar>';

const {Question, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class ReactBNumber extends Question {

  constructor(params) {
    super(params);
    this.freeze();
    const question = makeQuestion();
    this.addQuestion(question);
    this.addAnswer(explain());
    this.makeContent();
  }
  
}

module.exports = ReactBNumber;
Object.assign(ReactBNumber, {
  id: 'reactBNumber',
  title: 'ReactBNumber',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const POINTS = 15;


function makeQuestion() {
  let text = '';
  text += `
    Given the following attempt at a \`react.js\` component for a
    Binghamton University *B-Number*:

    ~~~
    01    class BNumber {
    02      constructor(props) {
    03        this.state = {
    04          input: '',
    05          error: '',
    06        };
    07      }
    08
    09      onBlurHandler(event) {
    10        const input = this.state.input;
    11        if (!input.match(/^B\d+/)) { //validate
    12          this.state.error = 'invalid B-number'
    13        }
    14      }
    15
    16      render() {
    17        return (
    18          B-Number:
    19          <input onBlur={this.onBlurHandler}>
    20          <br>
    21          <span class="error">{this.state.error}</span>
    22        );
    23      }
    24
    25    }
    ~~~

    You may assume that all necessary libraries have been included.

    Identify bugs and inadequacies in the above implementation of
    \`BNumber\`.  "${POINTS}-points" 

  `;
  return text;
}

function explain(params) {
  let text = '';
  text += `
    Outright bugs:

      + Line \`01\`: When an ES6 class is used to implement a \`react.js\`
        component, the class should extend \`React.Component\`.

      + Line \`03\`: The constructor should call \`super(props)\`.

      + Line \`10\`: The blur handler refers to \`this\`, but when called
        by the DOM, \`this\` will be set to the HTML widget on which the
        handler was registered.  However, we need to have \`this\` set
        to point to the react component.

        This can be achieved by adding the line

        ~~~
        this.onBlurHandler = this.onBlurHandler.bind(this);
        ~~~

        to the constructor.

      + Line \`10\`: \`state.input\` is never updated, so it will always be
        empty.

        One fix would be to remove it from the \`state\` and have its
        value accessed directly using \`event.target.value\` (the
        \`event\` will need to be added as an argument to the handler).
        However, this would violate the "single source of truth" react
        principle: some portions of the state would be maintained
        within the component and other portions maintained in the DOM.
       
        A better fix would be to add a handler for \`onChange\` and have
        that handler update \`state.input\`, maintaining all state
        within the component.

      + Line 12\`: The component state should never be set directly; it
        should only be set using \`setState()\`.

      + Lines \`19\` and \`20\`: JSX expressions consist of well-formed
        XML.  Hence the \`<input...>\` element should be \`<input.../>\`
        and the empty \`<br>\` element should be written as \`<br/>\`.

      + Line \`18\`: React only allows a single JSX element embedded
        within JavaScript, not a sequence of adjacent elements.  Hence
        those expressions should be wrapped within a top-level element
        like a \`<div>\`.

    Inadequacies include the following:

      + For better accessibility, the \`B-Number:\` text should be
        associated with the \`<input>\` widget.  This can be done
        by wrapping both within a \`<label>\` element.

      + The validation regex checks for start of the string using
        \`^\` but does not check for the end of the string allowing
        garbage after a correct B-number; this can be fixed by
        adding a \`$\` at the end of the regex.

      + The validation would fail if there were leading whitespace
        characters or (with the above fix) trailing whitespace
        characters.  This can be avoided by using \`trim()\` on the
        value before matching it with the validation regex.

      + The error message could be more specific by specifying the
        entered value for which the validation failed.

    Identifying around 5 of these problems should be sufficient to
    get full credit for this question.                  

  `;
  return text;
}


if (process.argv[1] === __filename) {
  console.log(new ReactBNumber().qaText());
}
