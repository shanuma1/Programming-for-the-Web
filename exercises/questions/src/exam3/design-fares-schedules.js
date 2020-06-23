'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-05-11 18:35:08 umrigar>';

const {Question, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class DesignFaresSchedules extends Question {

  constructor(params) {
    super(params);
    this.freeze();
    const question = makeQuestion();
    this.addQuestion(question);
    this.addAnswer(explain());
    this.makeContent();
  }
  
}

module.exports = DesignFaresSchedules;
Object.assign(DesignFaresSchedules, {
  id: 'designFaresSchedules',
  title: 'Fares & Schedules',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const POINTS = 15;


function makeQuestion() {
  let text = '';
  text += `
    A consolidator website wants to sell air tickets from several
    different airlines directly to consumers:

      + The website can access information for schedules and ticket
        prices by using web services provided by the airlines.

      + The airlines inform the consolidator that the fares and
        schedules can change on a daily basis.

      + The airlines give the consolidator a small discount on their
        published fares, but charge the consolidator for *each* web
        service call.

    The consolidator wants to provide a web page where consumers can
    search for fare and schedule results for specific departure and
    arrival cities and dates.  The consolidator knows that less than
    2% of the consumers who view these results actually follow through
    to make a purchase.  The consolidator also notices that the fares
    and schedules provided by the airline web services change much less
    frequently than daily.

    It is your task to come up with a technical solution which allows
    the consolidator to minimize the cost for displaying the results
    for a consumer's fares and schedules search.  Your answer should
    specifically describe:

      + When you would call the airline web services.

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
    consolidator website to incur the cost of making calls to the
    airline web services to display the results.  Given that the
    consolidator observes that the information does not change on a
    daily basis, it makes sense that the consolidator make use of
    agressive (non-HTTP) caching to minimize the cost of accessing the
    airline web services.

    One possibility, is to maintain a cache on the consolidator
    servers of previous requests/responses for previous web service
    calls. When a consumer does a search, the search is first made on
    this cache.  The web service call to the airline is made lazily
    only when the cache cannot satisfy the consumer's search.

    It is possible to get more agressive with the caching strategy.
    Typically, airlines have a fixed weekly schedule; hence instead of
    looking for an exact match for the consumer's departure and
    arrival dates in the cache, the consolidator would look only for
    matching the day of the week.

    Getting even more agressive, the consolidator can attempt to
    predict the airline fares.  This may involve setting up some
    kind of learning system which attempts to predict the fares based
    on factors like day-of-week, holidays, distance into the future and
    rounding rules.

    Especially with the more agressive caching strategies, it is
    entirely possible that the cached information will not match that
    provided by the airline web services.  If the consumer does not
    proceed past the search results, then these mis-matches do not
    matter at all.  It is imperative that the consolidator make actual
    airline web service calls to verify the information given to the
    consumer before allowing the consumer to complete a purchase.
    Some of these web service calls will reveal that the cached
    information is incorrect.

    There are two kinds of mis-matches:

      + The cache predicts a schedule which is not offered by the
        airline.  This can be handled by giving the consumer a message
        to the effect that the schedule is no longer available and
        providing a fresh set of data based on an actual web service
        call (the fact that the consumer is in the purchase flow makes
        it worthwhile for the consolidator to incur the cost of the
        call).

      + The cache predicts a fare which does not match that returned
        by the airline web service.  This could be handled the same
        way as a mis-predicted schedule.  OTOH, the consolidator can
        simply stay with the original predicted fare, incurring extra
        profit or making a loss.

    The caching would be done within the consolidator's servers.  The
    consolidator could hide the details of the caching and the airline
    web services behind its own web service.  The client (browser) would
    call these consolidator web services directly.  The advantages of
    doing so:

       + The GUI code for different kinds of browsers (mobile vs
         desktop) would run entirely within a browser.

       + The consolidator web services provide a well-defined API between
         the server developers and front-end developers.

       + Makes it easy to evolve the GUI to the fast-moving browser platform.

      
  `;
  return text;
}


if (process.argv[1] === __filename) {
  console.log(new DesignFaresSchedules().qaText());
}
