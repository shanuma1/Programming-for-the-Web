'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-05-11 11:31:53 umrigar>';

const {Question, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class DomTemperatures extends Question {

  constructor(params) {
    super(params);
    this.freeze();
    const question = makeQuestion();
    this.addQuestion(question);
    this.addAnswer(explain());
    this.makeContent();
  }
  
}

module.exports = DomTemperatures;
Object.assign(DomTemperatures, {
  id: 'domTemperatures',
  title: 'DomTemperatures',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const POINTS = 15;


function makeQuestion() {
  let text = '';
  text += `
Given the following HTML fragment:

     .code(lang=html)

     ~~~
     <table id="day-temperatures">
       <tr>
         <th>Time</th>
	 <th>Celsius</th>
	 <th>Fahrenheit</th>
       </tr>
       <tr class="morning">
         <td>08:00</td>
	 <td>30C</td>
	 <td>86F</td>
       </tr>
       <tr class="afternoon">
         <td>13:00</td>
	 <td>40C</td>
	 <td>104F</td>
       </tr>
       <tr class="evening">
         <td>18:00</td>
	 <td>35C</td>
	 <td>95F</td>
       </tr>
     </table>
     ~~~

    Give JavaScript code fragments which uses either jquery or DOM
    selector functions to return the following information from the
    above table markup:

      # A list of all the \`<td>\` DOM elements for the afternoon row.

      # A list of all the \`<td>\` DOM elements for the afternoon row
        which are at even indexes assuming that the first element is
        regarded as (even) index 0.

    Your accessor code should work even when the page contains
    other tables similar to the above.  "${POINTS}-points"


  `;
  return text;
}

function explain(params) {
  let text = '';
  text += `
    We give code which does not use \`querySelector()\` and
    \`querySelectorAll()\` as well as code which does use them.  Note
    that since CSS selectors use 1-origin indexing, the CSS indexes
    used in the second alternatives are different from the JavaScript
    indexes used in the first alternative (also, when we specify even
    JavaScript indexes, we specify odd CSS indexes).

    For formatting reasons, the jquery answers pull out the
    \`day-temperatures\` id into a variable \`id =
    '#day-temperatures'\` and use JavaScript template strings.


      # Simply get into the table, pick up the 3rd \`tr\` and get
      	all of its \`td\` elements:

	~~~
	const tds = 
	   document.getElementById('day-temperatures').
	     getElementsByTagName('tr')[2].
	     getElementsByTagName('td');
	~~~

  	Using \`querySelectorAll()\`:

	~~~
	const sel = 
	  '#day-temperatures tr:nth-child(3) td';
	const tds =
	  document.querySelectorAll(sel);
	~~~


	With both alternatives, if we wanted a proper JS array, wrap using
	\`Array.prototype.slice.apply()\`.

        Using jquery:

        ~~~
        $(\`\${id} tr:nth-child(3) td\`)
        ~~~

      # To pick up all the even elements, simply filter them:

	~~~
	const evens = Array.prototype.slice.apply(
	   document.getElementById('day-temperatures').
	     getElementsByTagName('tr')[2].
	     getElementsByTagName('td')).
	   filter((_, i) => i%2 === 0);
	~~~

  	Using \`querySelectorAll()\`:

	~~~
        const id = '#day-temperatures';
	const sel = 
	  \`\${id} tr:nth-child(3) td:nth-child(odd)\`;
	const tds =
	  document.querySelectorAll(sel);
	~~~

        Using jquery, we can qualify the \`td\` elements to be at even
        JavaScript indexes by specifying odd CSS indexes.

        ~~~
        $(\`\${id} tr:nth-child(3) td:nth-child(odd)\`)
        ~~~


  `;
  return text;
}


if (process.argv[1] === __filename) {
  console.log(new DomTemperatures().qaText());
}
