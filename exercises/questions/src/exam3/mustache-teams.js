'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-05-11 10:35:21 umrigar>';

const {Question, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class MustacheTeams extends Question {

  constructor(params) {
    super(params);
    this.freeze();
    const question = makeQuestion();
    this.addQuestion(question);
    this.addAnswer(explain());
    this.makeContent();
  }
  
}

module.exports = MustacheTeams;
Object.assign(MustacheTeams, {
  id: 'mustacheTeams',
  title: 'Mustache Teams',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const POINTS = 20;


function makeQuestion() {
  let text = '';
  text += `
  # You are given a JavaScript list \`gameScores\` of combined scores of
    NBA games where each element of the list has keys \`teams\`, \`date\`
    and \`score\` and is of the form:

    ~~~
    {
      teams: Teams, //string of form WinningTeam-LosingTeam
      date: Date,   //string of form YYYY-MM-DD
      score: Score, //integer giving sum of both team scores
    }
    ~~~

    Example data:

    ~~~
    const GAME_SCORES = [
      { teams: 'Pistons-Nuggets',
        date: '1983-12-13',
        score: 370
      },
      { teams: 'Pistons-Lakers',
        date: '1950-11-22',
        score: 37
      },
      { teams: 'Mavericks-Blazers',
        date: '2018-12-04',
        score: 213
      }
    ];
    ~~~


      # Critique the above data representation.

      # Write a function .~renderScores(gameScores)~ which uses
        \`mustache.js\` to render .~gameScores~ into a HTML table, such
        that:

          + The return value of the function should be a string
            containing the rendered HTML with top-level element
            \`<table>\`.
 
          + The table should have a 3-column heading row with the
            columns labelled *Teams*, *Date* and *Score* respectively.

          + The heading row must be followed by data rows, one
            for each item in \`gameScores\` with its \`Teams\`, \`Date\` and
            \`Score\` in the appropriate column.

          + The table must have a CSS class of \`gameScores\`.

          + if \`Score < 150\`, then the data row should have its CSS class
            set to \`low\`.

          + if \`150 <= Score < 250\`, then the data row should have its CSS
            class set to \`mid\`.

          + if \`Score >= 250\`, then the data row should have its CSS class
            set to \`high\`.

        For example, given the above example data, the call
        .~renderScores(GAME_SCORES)~ should return:
        

        \`\`\`
        <table class="gameScores">
          <tr><th>Teams</th><th>Date</th><th>Score</th></tr>
          <tr class="high">
            <td>Pistons-Nuggets</td>
            <td>1983-12-13</td>
            <td>370</td>
          </tr>
          <tr class="low">
            <td>Pistons-Lakers</td>
            <td>1950-11-22</td>
            <td>37</td>
          </tr>
          <tr class="mid">
            <td>Mavericks-Blazers</td>
            <td>2018-12-04</td>
            <td>213</td>
          </tr>
        </table>
        \`\`\`

        modulo whitespace.

        You may assume that the \`mustache\` module has been
        \`require\`'d and is available using identifier
        \`mustache\`. "${POINTS}-points"
  `;
  return text;
}

function explain(params) {
  let text = '';
  text += `
      # The problem with the representation is that valuable information
        is encoded into strings and it will be necessary to parse
        strings in order to extract the information.

          + To extract the name of the winning and losing teams it
            will be necessary to do something like .~teams.split('-')~.
            This would be problematic if a team name contains a hyphen.
            It would be better to have a separate field for each team.

          + The year, month and day of the game-date are buried within
            a string.  It would be better to use a JavaScript \`Date\`
            object.

      # Since mustache is logic-less, it is necessary to perform the
        \`low-mid-high\` computations outside the template.  So the
        function could look like:


        ~~~
        const LO = 150, MID = 250;

        const TEMPLATE = \`
          <table class="gameScores">
            <tr><th>Teams</th><th>Date</th><th>Score</th></tr>
            {{#gameScores}}
              <tr class="{{klass}}">
                <td>{{teams}}</td><td>{{date}}</td><td>{{score}}</td>
              </tr>
            {{/gameScores}}
          </table>
        \`;
     
        function renderScores(gameScores) {
          const augmentedGameScores =
            gameScores.map(function(gameScore) {
              const {score} = gameScore;
              const klass =
                score < LO ? 'low'
		: score < MID ? 'mid' : 'high';
              return { ...gameScore, klass: klass };
            });
          const view = {
	    gameScores: augmentedItemScores
	  };
          return mustache.render(TEMPLATE, view);
        }
        ~~~
  `;
  return text;
}


if (process.argv[1] === __filename) {
  console.log(new MustacheTeams().qaText());
}
