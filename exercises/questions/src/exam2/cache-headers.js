'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-04-14 20:24:49 umrigar>';

const {Question, Rand, emacsTimestampToMillis} = require('gen-q-and-a');

class CacheHeaders extends Question {

  constructor(params) {
    super(params);
    this.addParamSpec(PARAMS);
    this.addQuestion(QUESTION);
    this.freeze();
    this.addAnswer('The answers follow:\n');
    for (const answer of this.params.answers) {
      this.addAnswer(`  # ${answer.replace(/\n/g, ' ')}`);
    }
    this.makeContent();
  }

}

module.exports = CacheHeaders
Object.assign(CacheHeaders, {
  id: 'cacheHeaders',
  title: 'Cache Headers',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

//hackery: question should allow a function
const QUESTION = `
Discuss the choice of cache control headers in each of the following
situations.  You should assume that the caching strategy is as
aggressive as possible, consistent with correct application semantics.
"20-points"

  # #{questions[0]}

  # #{questions[1]}

  # #{questions[2]}

  # #{questions[3]}

`;

const DATA = {
  sensitive: {
    choices: {
      welfare: {
	desc: `
          A response to a request for receiving welfare benefits.
          `,
      },
      medical: {
        desc: `
          A response to a request for medical information.
        `,
      },
    },
    explain: `
      Since this is likely to be regarded as sensitive information,
      the headers should be set up to safeguard privacy.  Hence we do
      not want the response stored anywhere, so our header should
      minimally include \`no-store\`.  In case, caches do not
      understand \`no-store\`, it may also be a good idea to also
      include \`no-cache\` and \`must-revalidate\`.  In an abundance
      of caution, we may also include \`private\`:

      Hence the headers would be \`Cache-Control: private, no-store,
      no-cache must-revalidate\`.
    `,
  },
  dailyAnyTime: {
    choices: {
      library: {
        desc: `
          A response to a library catalog search.  The catalog is
          updated once a day using a batch process.
        `,
      },
      grocery: {
        desc: `
          A response to a search on what is in stock at a grocery
          store.  The information is updated once a day using a batch
          process.
        `,
      },
      departmentStore: {
        desc: `
          A response to a search on what is available at a department
          store.  The information is updated once a day using a batch
          process.
        `,
      },
    },
    explain: `
      This is not sensitive information; hence it can be stored in a 
      a \`public\` cache.  Since we know that the information is updated
      once a day, we can include a cache expiry time of one day using
      \`max-age=86400\`.  However, we do not know when exactly the
      information is updated relative to the time the cached response
      was sent.  So we should also include \`no-cache\`.

      Hence the header would be: \`Cache-Control: public,
      max-age=86400, no-cache\`.
    `,
  },
  dailyFixed: {
    choices: {
      library: {
        desc: `
          A response to a library catalog search.  The catalog is
          updated daily at 6:00pm using a batch process.
        `,
      },
      grocery: {
        desc: `
          A response to a search on what is in stock at a grocery
          store.  The information is updated daily at 6:00pm using a batch
          process.
        `,
      },
      departmentStore: {
        desc: `
          A response to a search on what is available at a department
          store.  The information is updated daily at 6:00pm using a batch
          process.
        `,
      },
    },
    explain: `
      This is not sensitive information; hence it can be stored in a 
      a \`public\` cache.  Since we know that the information is updated
      daily at 6:00pm, we can include a cache expiry time of up to one day using
      \`max-age=\`"SSS" where "SSS" is the number of seconds remaining for
      the next daily update.  Since we are guaranteed that the information
      will not change until 6:00pm the next day, we do not need to
      revalidate.

      Hence the header would be: \`Cache-Control: public,
      max-age=\`"SSS".
    `,
  },
  infinite: {
    choices: {
      image: {
	desc: `
          A \`.png\` image.  It is guaranteed that the URL is changed
          whenever the image is changed.
        `,
      },
      css: {
	desc: `
          A CSS stylesheet.  It is guaranteed that the URL is changed whenever
          the stylesheet is changed.
        `,
      },
      module: {
	desc: `
          A JavaScript module.  It is guaranteed that the URL is
          changed whenever the module is changed.
        `,
      },
    },
    explain: `
      This an instance of the pattern which uses an "infinite" cache
      time for a resource whose URL is changed whenever that resource
      is changed.  We can specify an ."infinite" cache time as say 1
      year using a \`max-age\` of 31536000 seconds.  Usually, this
      information could also be stored in \`public\` shared caches.

      Hence the header would be: \`Cache-Control: public,
      max-age=31536000\`.
    `,
  },
  
};


const PARAMS = [
  { order: () => Rand.permutation(Object.keys(DATA)),
  },
  { choices: ({order}) =>
      order.map(k => Rand.choice(Object.keys(DATA[k].choices))),
  },
  { _type: 'nonRandom',
    questions: ({order, choices}) =>
      order.map((k, i) => DATA[k].choices[choices[i]].desc),
    answers: ({order}) => order.map(k => DATA[k].explain),		
  },
];

if (process.argv[1] === __filename) {
  console.log(new CacheHeaders().qaText());
}
