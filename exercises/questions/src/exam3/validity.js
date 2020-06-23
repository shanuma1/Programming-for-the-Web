'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-05-11 14:42:27 umrigar>';

const {Question, Rand, emacsTimestampToMillis} = require('gen-q-and-a');

class Validity extends Question {

  constructor(params) {
    super(params);
    this.addParamSpec(PARAMS);
    this.addQuestion(QUESTION);
    this.freeze();
    this.addAnswer(ANSWER);
    this.makeContent();
  }

}

module.exports = Validity
Object.assign(Validity, {
  id: 'validity',
  title: 'Discuss Validity',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const POINTS = 20;
//hackery: question should allow a function
const QUESTION = `
Discuss the validity of the following statements.  What is more
important than whether you ultimately classify the statement as *true*
or *false* is your justification for arriving at your
conclusion. "${POINTS}-points"

  # #{questions[0]}

  # #{questions[1]}

  # #{questions[2]}

  # #{questions[3]}

  # #{questions[4]}
`;

const ANSWER = `
The answers follow:

  # #{answers[0]}

  # #{answers[1]}

  # #{answers[2]}

  # #{answers[3]}

  # #{answers[4]}
`;

const DATA = {
  mustacheEscape: {
    question: `
      Mustache will always escape any HTML characters in rendered
      strings.
    `,
    answer: `
      Mustache will escape HTML characters in rendered strings
        if those strings are rendered within double-braces but
        not within triple-braces.  Hence the statement is *false*
        in general.
    `,
  },
  imageCache: {
    question: `
      The cache time specified for images should be the same
      as that for their containing HTML page.
    `,
    answer: `
      In general, an image may be referenced by multiple HTML
      pages with different cache times.  So this would not
      be possible in general.

      Usually, the following pattern is used to maximize the caching
      of static assets like images: each version of an image is
      specified using a distinct URL having an ."infinite" cache time.
      When an image is changed, the containing HTML pages are changed
      to refer to the URL corresponding to the new version.

      Hence the statement is *false*.
    `,
  },
  bubbleStop: {
    question: `
      If the propagation of a DOM event is stopped in its bubble
      phase, the event will never enter its capture phase.
    `,
    answer: `
      Since the capture phase precedes the bubble phase, the capture
      phase will have run before the event propagation is stopped in
      its bubble phase.  Hence the statement is *false*.
    `,
  },
  cookies: {
    question: `
      By default, cookies can be accessed on both the client
      (browser) and the server.
    `,
    answer: `
      Unless cookies have been specified to be \`HttpOnly\`, they can
      be accessed on both client and server.  Hence the statement is
      *true*.
    `,
  },
  escape: {
    question: `
      Different escaping rules need to be used for escaping different
      components of URLs.    `,
    answer: `
      The rules for escaping the domain part of a URL are quite
      different from the rules used for escaping a query parameter.
      Hence the statement is *true*.
    `,
  },
  stateStore: {
    question: `
      To avoid problems with users tampering with state, state should
      be stored only on the server.
    `,
    answer: `
      State is useful on the server only if it is possible to tie a
      request to that state.  This is not possible without having
      minimal client-side state like a session ID.  The client-side
      state can be made tamper-proof by having the server sign it, but
      client-side state is required.  Hence the statement is *false*.
    `,
  },
  htmlFixed: {
    question: `
      Unlike XML, in HTML the set of element and attribute names
      are fixed for a specific version of HTML.
    `,
    answer: `
      This is *almost* true, but there is one notable exception.  In
      modern HTML5, elements can have any attributes with names starting
      with \`data-\`.  Hence the statement is *false*.
    `,
  },
  sliders: {
    question: `
      HTML allows sliders as input widgets.
    `,
    answer: `
      HTML does allow sliders using \`<input type="range"...>\`
      and the statement is *true*.
    `,
  },
  mustache: {
    question: `
      It is possible to set up a mustache template such that it can
      directly display the properties of an arbitrary object in the
      view mixed into the template.
    `,
    answer: `
      The property names of the object need to be known within the
      template or provided as a list to the template.  Hence it is
      not possible for a template to display the properties of an
      arbitrary object and the statement is *false*.
    `,
  },
  median: {
    question: `
      Even when a DOM element has a bubble handler for an event, the
      event will always continue to bubble up the containment
      hierarchy to any containing elements which have declared a
      handler for that event.
    `,
    answer: `
      Not necessarily.  It is possible that the handler calls
      \`event.stopPropagation()\` which will stop bubbling the event
      up to containing elements.  Hence the statement is *false*.
    `,
  },
};

const N_QUESTIONS = 5; //cannot change since hardcoded assumption of 5
const PARAMS = [
  { keys: () => Rand.choices(5, Object.keys(DATA)),
  },
  { _type: 'nonRandom',
    questions: ({keys}) => keys.map(k => DATA[k].question),
    answers: ({keys}) => keys.map(k => DATA[k].answer),
  },
];

if (process.argv[1] === __filename) {
  console.log(new Validity().qaText());
}
