'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-05-10 21:18:32 umrigar>';

const {Question, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class Performance extends Question {

  constructor(params) {
    super(params);
    this.freeze();
    const question = makeQuestion();
    this.addQuestion(question);
    this.addAnswer(explain());
    this.makeContent();
  }
  
}

module.exports = Performance;
Object.assign(Performance, {
  id: 'performance',
  title: 'Performance',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const POINTS = 15;


function makeQuestion() {
  let text = '';
  text += `
    The performance of a web page leaves something to be desired as there
    is a noticeable delay when loading the page into a browser.  What are
    some preliminary checks you would undertake to see if there are some
    easy fixes for the slow load? "${POINTS}-points"
  `;
  return text;
}

function explain(params) {
  let text = '';
  text += `
      # Maximize the cachability of all resources used by that page:

          # Ensure embedded resources like images, scripts and
	    stylesheets are cached for an ."infinite" time and updates
	    are made by specifying a new URL for the updated version.

          # Other resources should be setup to maximize caching.
	    Specify caching unless precluded by content semantics or
	    security considerations.  Use conditional get's to
	    minimize fetching of actual content from origin servers.

      # Serve the smallest representation of resources: minify JavaScript
        files and serve all resources compressed to browsers which support
	compression (based on browser \`Accept\` headers).

      # Minimize the number of HTTP requests needed to load each page
        by combining multiple resources into a single resource using
        bundling tools like \`webpack\`.

      # Avoid blocking the browser as far as possible by loading
        resources asynchronously wherever possible.

      # When possible, load stylesheets in the document \`head\` section
        and scripts at the end of the document \`body\`.

      # Amortize the cost of embedded resources by sharing them across
        multiple pages.

  `;
  return text;
}


if (process.argv[1] === __filename) {
  console.log(new Performance().qaText());
}
