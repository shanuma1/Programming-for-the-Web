'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-04-15 02:22:28 umrigar>';

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
  id: 'discussValidity',
  title: 'Discuss Validity',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

//hackery: question should allow a function
const QUESTION = `
Discuss the validity of the following statements.  What is more
important than whether you ultimately classify the statement as *true*
or *false* is your justification for arriving at your
conclusion. "20-points"

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
  etags: {
    question: `
      An \`etag\` validator should always be preferred over a \`last-modified\`
      validator.
    `,
    answer: `
      A \`last-modified\` validator has the disadvantage of a 1-second
      granularity where it is possible that a cache incorrectly caches
      a resource if it changed within 1 second after being fetched by
      the cache.  It also has the disadvantage that it is not
      (usually) useful as a weak validator.  It's one advantage is
      that it may work with legacy caches where \`etags\` may not.  So
      the statement is sort-of *true* and one can get the best of both
      by specifying both in the returned headers.
    `,
  },
  cookies: {
    question: `
      If no cookies have been set between consecutive requests to
      different portions of a web site, then the cookies sent
      by the user-agent will be the same.
    `,
    answer: `
      The cookies sent can depend on the sub-domain and path of a
      request.  Hence different cookies could be sent for different
      portions of a web site and the statement is *false*.
    `,
  },
  garbageDisplay: {
    question: `
      The most likely cause for a browser displaying garbage text
      when accessing a particular web page is a problem with the
      browser in that the returned data is causing the browser
      to misbehave.
    `,
    answer: `
      The fact that it is happening on a particular web page would
      lead one to suspect the web page rather than the browser. In
      fact, the most likely cause is an incorrect header being sent by
      the server, most probably an incorrect character set or mime-type
      (with the former being more likely).  Hence the statement is
      *false*.
    `,
  },
  language: {
    question: `
      A browser can diplay the same URL in different languages depending
      on the user's language preferences.
    `,
    answer: `
      This can be achieved using the \`Accept-Language\` header which
      allows the browser to tell the server about the user's language
      preferences.  Hence the statement is *true*.
    `,
  },
  host: {
    question: `
      A single web server can host web sites belonging to many
      different organizations.
    `,
    answer: `
      This is possible with HTTP 1.1, since every HTTP 1.1 request
      must contain a \`Host\` header specifying the domain for
      the incoming request.  Using this domain it is possible for
      the web server to separate out requests for different web
      sites and the statement is *true*.
    `,
  },
  badGet: {
    question: `
      Since \`GET\` is a safe method which cannot change observable state,
      it is impossible to use a \`GET\` to update a resource on a server.
    `,
    answer: `
      I wish!! \`GET\` is supposed to be used as a *safe* method, but
      there is nothing preventing programmers from using it incorrectly.
      Hence the statement is *false*.
    `,
  },
  badREST: {
    question: `
      It is possible to build remote procedure calls in a \`REST\`ful
      style by using urls like \`/getUser?userId=1234\`,
      \`/updateUser?userId=1234\` and \`/deleteUser?userId=1234\`.
    `,
    answer: `
      It is indeed possible to build web sites/services using such
      a style, but that style would be far from \`REST\`ful and
      the statement is *false*.
    `,
  },
  import: {
    question: `
      It is possible to dynamically import a module whose name is not
      known until runtime by using a statement like 
      .~import module from~ "MODULE" .- \`;\` where "MODULE" is 
      a variable containing
      the name of the module to be imported.
    `,
    answer: `
      It is not possible to do this using a .~import~ *statement*,
      where the specification of the module must be specified
      statically.  Hence the statement is *false*.  Note that dynamic
      imports can be done using the .~import()~ *function*.   
    `,
  },
  etags: {
    question: `
      If a program uses a library version 1.2.3, then upgrading
      that program to use newer and better version 2.1.1 of the
      library is a no-brainer decision.
    `,
    answer: `
      The major version of the library has changed from 1 to 2.
      If the library uses semantic versioning, it is very likely
      that the API supported by the upgraded library is not backward
      compatible with that of the older version.  Ugrading the program
      to use the new version of the library may require major changes
      to the program and is not a decision which should be carried
      out lightly.  Hence the statement is *false*.      
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
