'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-05-11 01:05:18 umrigar>';

const {Question, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class AbsRelUrls extends Question {

  constructor(params) {
    super(params);
    this.freeze();
    const question = makeQuestion();
    this.addQuestion(question);
    this.addAnswer(explain());
    this.makeContent();
  }
  
}

module.exports = AbsRelUrls;
Object.assign(AbsRelUrls, {
  id: 'absRelUrls',
  title: 'Absolute versus Relative URLs',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const POINTS = 15;


function makeQuestion() {
  let text = '';
  text += `
    Discuss the tradeoffs between using absolute versus relative URLs.
    "${POINTS}-points"
  `;
  return text;
}

function explain(params) {
  let text = '';
  text += `
    Using relative URLs make it easier to reorganize a website's content.
    Specifically, it is possible to move a portion of the content to
    a different location and links within the moved content do not
    need to change as long as they used relative URLs.  Due to this
    advantage, relative URLs should be preferred over absolute URls
    except under the following circumstances:

      + An absolute URL is necessary because the URL refers to a different
        server or a different scheme ( . - \`http\` versus \`https\`).

      + Even though a relative URL is possible, there is no logical
        relationship between the linking resource and the linked
        resource.  For example, if a website offers independent
        services like "look up a person" and "research a vehicle by
        VIN" the two services do not have any discernible logical
        relationship and it is conceivable that one of th services
        could be moved onto another website in the future. Using
        absolute URLs would serve to document that they are
        unrelated.

  `;
  return text;
}


if (process.argv[1] === __filename) {
  console.log(new AbsRelUrls().qaText());
}
