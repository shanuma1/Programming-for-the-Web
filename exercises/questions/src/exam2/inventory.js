'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-04-29 02:10:29 umrigar>';

const {Question, Rand, emacsTimestampToMillis} = require('gen-q-and-a');

class Inventory extends Question {

  constructor(params) {
    super(params);
    this.addParamSpec(PARAMS);
    this.addQuestion(QUESTION);
    this.freeze();
    this.addAnswer(ANSWER);
    this.makeContent();
  }

}

module.exports = Inventory
Object.assign(Inventory, {
  id: 'inventory',
  title: 'Inventory Web Service and Persistence Support',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const QUESTION = `
Part (a) of this question requires you to design web services, while
Part (b) requires you to design an interface to support those web
services.

  # Design RESTful web services for maintaining an inventory of
    widgets for a product catalog.  The basic function of an inventory
    is to track the number in stock for each kind of widget.

    A widget will have attributes like name and description, both of
    which can be indexed by keywords.  A widget is identified by an
    *SKU Stock Keeping Unit* ID.

    Your web services should allow searching for, adding, updating and
    removing widgets from the inventory.  Your answer should include:

      + A discussion of how you would handle the situation
        where an end-user supported by your web services has
        put one-or-more widgets into a shopping cart and then
        abandons the cart.  You should not trust the
        client program between the end-user and your web services.

      + The URLs you would use for each services.

      + The HTTP methods used for each service.

      + Support for HATEOAS.  "23-points"  

    Your answer should resemble the requirements for *Project 3*.
    "23-points"

  # Design an *interface* for a persistence store to support the
    inventory web services from the previous question.  Your answer
    should include:

      + A specification for the interface.

      + A discussion of error situations.

    Your answer should resemble the requirements for *Project 2*.
    "22-points"

`;

const ANSWER = `
  To handle the situation where a removal from the inventory is
  tentative we can have a web service which reserves a certain number
  of widgets and tentatively removes that number of widgets from the
  inventory.  We would also have a web service which can be called to
  confirm the removal.  If the confirmation web service is not called
  within a specific period of time, then the reservation is canceled
  and the reserved widgets are restored to the available inventory.

  The following design decouples information about widgets from the
  inventory of widgets.  Doing so permits the ability to maintain
  historical information about widgets long after they have been
  retired from active inventories.

  We will have the following URLs for widgets:

    + \`/widgets\`.  A \`GET\` to this URL would result in a scrolled set of
      widgets filtered by optional query parameters.  A \`POST\` to this URL
      would allow creating a new widget; the SKU number identifying the
      widget must be included with the \`POST\` body parameters.  The
      response would be a 302 redirect to the URL for the widget (given
      by the following URL).  An attempt to create a widget with an
      sku identical to the sku of an existing widget would result
      in a \`409 CONFLICT\` status being returned.

    + \`/widgets/\` .- "sku".  A \`GET\` to this URL would result in
      information about widget identified by "sku".  A \`PATCH\` to
      this URL would update the information for the widget identified
      by "sku".  There is no \`DELETE\` method as we would like to
      guarantee that widget information is retained for historical
      auditing (this assumes that "sku"'s are not recycled).

  The inventory would be accessed using the following URLs:

    + \`/inventory\`.  A \`GET\` to this URL would result in a
      scrolled set of inventories for the widgets identified by the 
      optional query parameters.

    + \`/inventory/\` .- "sku".  A \`GET\` to this URL would result in
      inventory information about widget identified by "sku".  Besides
      the current stock, the response may also include URLs for any
      outstanding reservations.  A \`PATCH\` to this URL would be
      used to add a number of widgets to the inventory.

    + \`/inventory/\` .- "sku" .- \`/reservations\`.  A \`GET\` to 
      this URL would result in a scrolled set of reservations for
      the widget identified by "sku".  A \`POST\` would reserve
      a specified number of widgets, with the \`Location\` header
      in the response specifying the URL of the newly created 
      reservation.

    + \`/inventory/\` .- "sku" .- \`/reservations\` .-
      "reservationId".  A \`GET\` to this URL would result in
      information about the reservation, including the amount of time
      left on the reservation. If the reservation has been canceled
      either explicitly or implicitly by timeout, then the response
      would return a 409 \`CONFLICT\`'. A \`DELETE\` to this URL would
      explicitly cancel the reservation and return the widget
      to the inventory.  

    + \`/inventory/\` .- "sku" .- \`/confirms\`.  A \`GET\` to this
      URL would result in a scrolled set of confirmed reservations for
      the widget identified by "sku".

    + \`/inventory/\` .- "sku" .- \`/confirms\` .- "reservationId".  A
      \`GET\` to this URL would show information about the confirmed
      reservation specified by "reservationId".  A \`POST\` to this
      URL would confirm the reservation and permanently reduce the
      inventory for the widget specified by "sku" by the amount
      reserved by reservation "reservationId".
   
  For HATEOAS, we could support the a URL like \`/\` which returns the
  links containing the URLs for widgets and inventories.  The widget
  information would contain links to the inventory, reservations and
  transfers URLs.  The reservations and transfers results would
  contain links to the widget information.  The returned inventory
  information would contain links to the widget, reservation and
  transfer URLs.  All search results could contain scrolling links for
  \`rel="next"\` and \`rel="prev"\`.

  The implementation would provide the following interface:

  ~~~
  /** Create widget specified by widgetInfo (which should include
   *  a SKU).  Returns sku of newly createad widget.
   */
  createWidget(widgetInfo);

  /** Return scrolled set of widgets identified by widgetInfo */
  getWidgets(widgetInfo);

  /** Return information about widget specified by sku. */
  getWidget(sku);

  /** Returns inventory associated with widget identified by sku
   */
  getInventory(sku);

  /** Reserve nUnits units of widget specified by sku. Returns
   *  reservationId.
   */
  reserveWidget(sku, nUnits);

  /** Cancel reservation specified by reservationId associated
   *  with widget specified by sku.
   */
  cancelReservation(sku, reservationId);

  /** Return scrolled set of active reservations associated with widget
   *  sku.
   */
  widgetReservations(sku);
 
  /** Return scrolled set of completed reservations associated with widget
   *  sku.
   */
  widgetTransfers(sku); 
  ~~~

Error conditions would include attempting to reserve more than the
available inventory, specifying incorrect or inconsistent ID's like
creating a widget with an sku identical to that of an existing widget,
or providing an inconsistent sku, reservationId combination for the 
.~cancelReservation()~ call.
    
`;

const PARAMS = [
];

if (process.argv[1] === __filename) {
  console.log(new Inventory().qaText());
}
