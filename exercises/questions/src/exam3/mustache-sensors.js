'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-05-11 14:49:43 umrigar>';

const {Question, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class MustacheSensors extends Question {

  constructor(params) {
    super(params);
    this.freeze();
    const question = makeQuestion();
    this.addQuestion(question);
    this.addAnswer(explain());
    this.makeContent();
  }
  
}

module.exports = MustacheSensors;
Object.assign(MustacheSensors, {
  id: 'mustacheSensors',
  title: 'Mustache Sensors',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const POINTS = 20;


function makeQuestion() {
  let text = '';
  text += `
    A graduate student thesis involves recording sensor readings at
    various locations on campus.

    The thesis involves using several different sensor models
    characterized by data like:

    ~~~
    const SENSOR_MODELS = {
      'GE-1234': { 
        model: 'GE-1234',
        lo: '32',            //values below this are low
        hi: '90',            //values above this are high
      },
      'HW-5678': { 
        model: 'HW-5678',
        lo: '48',
        hi: '132',
      },
      ...
    };
    ~~~

    There are multiple instances of each sensor model installed at
    different locations:

    ~~~
    const SENSORS = {
      '123a': { 
        sensorId: '123a', 
        model: 'GE-1234',
        gpsLocation: '42.088 -75.968', //location
      },
      'x434': { 
        sensorId: 'x434',
        model: 'HW-5678',
        gpsLocation: '42.0889911 -75.969246',
      }, 
      'z424': { 
        sensorId: 'z424',
        model: 'HW-5678',
        gpsLocation: '42.088346 -75.965223',
      }, 
      ...
    };
    ~~~

    Each sensor produces a sequence of timestamped readings:

    ~~~
    const SENSOR_READINGS = [
      { sensorId: '123a',
        dateTime: '20200511T164300',
        value: '95',
      }, 
      { sensorId: '123a',
        dateTime: '20200511T164100',
        value: '30',
      }, 
      { sensorId: '123a',
        dateTime: '20200511T164200',
        value: '45',
      }, 
      { sensorId: 'x434',
        dateTime: '20200511T164100',
        value: '140',
      }, 
      { sensorId: 'z424',
        dateTime: '20200511T164100',
        value: '59',
      }, 
      ....
    };
    ~~~

    All this information is collected together into a \`sensorsData\`
    object:

    ~~~
    sensorsData = {
      models: SENSOR_MODELS,
      sensors: SENSORS,
      readings: SENSOR_READINGS,
    };
    ~~~


      # Critique the above data representation.

      # Write a function .~renderReadings(sensorsData, sensorId)~
        which uses \`mustache.js\` to render all readings from
        \`sensorsData\` for the sensor specified by \`sensorId\`
        into a HTML table, such that:

          + The return value of the function should be a string
            containing the rendered HTML with top-level element
            \`<table>\`.
 
          + The table should have a 3-column heading row with the
            columns labelled *SensorId*, *DateTime* and *Value* respectively.

          + The heading row must be followed by data rows, one for
            each item in \`sensorsData.readings\` having the
            \`sensorId\` specified by the second argument.  Each row
            must have its \`sensorId\`, \`dateTime\` and \`value\` in
            the appropriate column.

          + The table must have a CSS class of \`sensorReadings\`.

          + if the sensor value in the row is less than the \`lo\`
            value of the corresponding sensor model, then the data
            row should have its CSS class set to \`low\`..

          + if the sensor value in the row is greater than the \`hi\`
            value of the corresponding sensor model, then the data
            row should have its CSS class set to \`high\`..

          + if the sensor value in the row is in between the \`lo\`
            and \`hi\` values (both inclusive) of the corresponding
            sensor model, then the data row should have its CSS class
            set to \`mid\`..

          + The rows must be sorted in increasing order by \`dateTime\`.


        For example, given the above example data, the call
        .~renderReadings(sensorsData, '123a')~ should return:
        

        \`\`\`
        <table class="sensorReadings">
          <tr><th>SensorId</th><th>DateTime</th><th>Value</th></tr>
          <tr class="low">
            <td>123a</td>
            <td>20200511T164100</td>
            <td>30</td>
          </tr>
          <tr class="mid">
            <td>123a</td>
            <td>20200511T164200</td>
            <td>45</td>
          </tr>
          <tr class="high">
            <td>123a</td>
            <td>20200511T164300</td>
            <td>95</td>
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
      # One problem with the representation is that valuable information
        is encoded into strings and it will be necessary to parse
        strings in order to extract the information.

          + To extract the location, it is necessary to parse the
            GPS location in the \`gpsLocation\` field.
            It would be better if the value has been parsed out into
            separate latitude and longitude objects or into some
            location object specified by a library.

          + The year, month and day and time for a sensor reading are
            buried within a string.  It would be better to use a
            JavaScript \`Date\` object.

          + Even the numbers are provided as strings.  They should
            be \`Number\`'s.

        Another problem is that the ID for \`SENSOR_MODELS\` and
        \`SENSORS\` is represented redundantly: once as a key
        as well as a property of the value.

      # Since mustache is logic-less, it is best to perform the
        \`low-mid-high\` computations outside the template.  So the
        function could look like:


        ~~~
        const TEMPLATE = \`
          <table class="sensorReadings">
            <tr><th>SensorId</th><th>DateTime</th><th>Value</th></tr>
            {{#readings}}
              <tr class="{{klass}}">
                <td>{{sensorId}}</td><td>{{dateTime}}</td><td>{{value}}</td>
              </tr>
            {{/readings}}
          </table>
        \`;
     
        function renderReadings(sensorsData, sensorId) {
          const sensor = sensorsData.sensors[sensorId];
          const model = sensorsData.models[sensor.model];
          const [lo, hi] = [Number(model.lo), Number(model.hi)];
          function readingKlass(reading) {
            const value = Number(sensorReading.value);
            return value < lo ? 'low' : value > hi ? 'high' : 'mid';
          }
          const readings =
            sensorsData.readings.filter(r => r.sensorId === sensorId)
              .sort((a, b) => a.dateTime < b.dateTime ? -1 
                            : a.dateTime > b.dateTime ? +1 : 0)
              .map(r => Object.assign({}, r, { klass: readingKlass(r) });
              return { ...gameScore, klass: klass };
            });
          return mustache.render(TEMPLATE, { readings });
        }
        ~~~
  `;
  return text;
}


if (process.argv[1] === __filename) {
  console.log(new MustacheSensors().qaText());
}
