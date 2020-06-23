'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-05-11 18:37:14 umrigar>';

const {Question, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class DesignChineseConglomerate extends Question {

  constructor(params) {
    super(params);
    this.freeze();
    const question = makeQuestion();
    this.addQuestion(question);
    this.addAnswer(explain());
    this.makeContent();
  }
  
}

module.exports = DesignChineseConglomerate;
Object.assign(DesignChineseConglomerate, {
  id: 'designChineseConglomerate',
  title: 'Chinese Conglomerate',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const POINTS = 15;


function makeQuestion() {
  let text = '';
  text += `
    A large Chinese conglomerate wants to sell directly to US
    consumers, but lacks the cultural expertise to market directly.
    Hence it decides to contract out with several US intermediaries to
    have them set up their own consumer-facing websites for the
    conglomerate's products.

      + The conglomerate provides the intermediaries with web services
        which provide the availability and cost of the conglomerate's
        products.

      + The conglomerate informs the intermediaries that the
        availability and costs can change on a daily basis.

      + The conglomerate gives each intermediary a small discount on
        the cost of its product, but charges the itermediary for
        *each* web service call.

    A particular intermediary decides to set up a web page where
    consumers can search for the conglomerate's products.  The
    intermediary knows that less than 2% of the consumers who view
    these search results actually follow through to make a purchase.
    The intermediary also notices that the availability and costs
    provided by the conglomerate web services change much less
    frequently than daily.

    It is your task to come up with a technical solution which allows
    the intermediary to minimize the cost for displaying the results
    for a consumer's search.  Your answer should specifically
    describe:

      + When you would call the conglomerate's web services.

      + The division of tasks between the customer's browser
        and the server.

    Your answer need not show any code or be concerned about the
    details of the GUI. "${POINTS}-points}"
    
  `;
  return text;
}

function explain(params) {
  let text = '';
  text += `
    Since less than 2% of consumers who view the results actually
    follow through with a purchase, it does not make sense for the
    intermediary website to incur the cost of making calls to the
    conglomerate web services to display the results.  Given that the
    intermediary observes that the information does not change on a
    daily basis, it makes sense that the intermediary make use of
    agressive (non-HTTP) caching to minimize the cost of accessing the
    consolidator's web services.

    One possibility, is to maintain a cache on the intermediary
    servers of previous requests/responses for previous web service
    calls. When a consumer does a search, the search is first made on
    this cache.  The web service call to the conglomerate is made lazily
    only when the cache cannot satisfy the consumer's search.

    It is possible to get more agressive with the caching strategy.
    Typically, the availability of a product will not change from
    day-to-day and it is possible for the intermediary to predict
    that a product will be available.  

    Getting even more agressive, the intermediary can attempt to
    predict the conglomerate's product cost.  This may involve setting
    up some kind of learning system which attempts to predict the
    costs based on patterns of previous costs and rounding rules.

    Especially with the more agressive caching strategies, it is
    entirely possible that the cached information will not match that
    provided by the conglomerate web services.  If the consumer does not
    proceed past the search results, then these mis-matches do not
    matter at all.  It is imperative that the intermediary make actual
    conglomerate web service calls to verify the information given to the
    consumer before allowing the consumer to complete a purchase.
    Some of these web service calls will reveal that the cached
    information is incorrect.

    There are two kinds of mis-matches:

      + The cache predicts an availability which is not offered by the
        conglomerate.  This can be handled by giving the consumer a
        message to the effect that the availability is no longer
        available and providing a fresh set of data based on an actual
        web service call (the fact that the consumer is in the
        purchase flow makes it worthwhile for the intermediary to
        incur the cost of the call).

      + The cache predicts a cost which does not match that returned
        by the conglomerate web service.  This could be handled the
        same way as a mis-predicted availability.  OTOH, the
        intermediary can simply stay with the original predicted cost,
        incurring extra profit or making a loss.

    The caching would be done within the intermediary's servers.  The
    intermediary could hide the details of the caching and the conglomerate
    web services behind its own web service.  The client (browser) would
    call these intermediary web services directly.  The advantages of
    doing so:

       + The GUI code for different kinds of browsers (mobile vs
         desktop) would run entirely within a browser.

       + The intermediary web services provide a well-defined API between
         the server developers and front-end developers.

       + Makes it easy to evolve the GUI to the fast-moving browser platform.

      
  `;
  return text;
}


if (process.argv[1] === __filename) {
  console.log(new DesignChineseConglomerate().qaText());
}
