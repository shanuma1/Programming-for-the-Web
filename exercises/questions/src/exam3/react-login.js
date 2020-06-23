'use strict';

const assert = require('assert');

const TIMESTAMP = 'Time-stamp: <2020-05-11 11:00:25 umrigar>';

const {Question, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class ReactLogin extends Question {

  constructor(params) {
    super(params);
    this.freeze();
    const question = makeQuestion();
    this.addQuestion(question);
    this.addAnswer(explain());
    this.makeContent();
  }
  
}

module.exports = ReactLogin;
Object.assign(ReactLogin, {
  id: 'reactLogin',
  title: 'React Login',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});

const POINTS = 15;


function makeQuestion() {
  let text = '';
  text += `
    Critique the following reactjs login component which validates
    the login using a \`authenticate()\` function passed in via
    \`props.services\`.

    ~~~
    class LoginComponent extends React.Component {

      constructor(props) {
        super(props);
	this.state = { errors: {}, email: '', password: '' };
      }

      onChange(event) {
        const { name, value} = event.target;
	this.state.name = value;
	const errors = this.state.errors;
	if (name === 'email') {
	  if (!value.match(/\@/)) {
	    errors[name] =
	      'email address must be of the form "user@domain"'; 
	  }
	}
	else if (name === 'password') {
	  if (!value.match(/[\w\W]{8}/)) {
	    errors[name] =
	      'password must contain at least 8 ' +
	      'characters with at least one digit and one ' +
	      'uppercase character';
	  }
	}
      }

      onSubmit() {
        const { email, password } = this.state;
	if (!props.services.authenticate(email, password)) {
	  this.state.errors._ = [ 'invalid login' ];b
	}
      }

      render() {
        const onChange = this.onChange;
        const onSubmit = this.onSubmit;
	const formErrors =
	  this.state.errors['_'].map((e) => {
	    return <li class="error">{e}</li>;
	  });
        return (
	  <ul>{formErrors}</ul>
	  <form onSubmit={onSubmit}>
	    <label>
	      Email: <input name="email" onChange={onChange}>
	      <br/>
	      <span class="error">
	        {this.state.errors.email}
	      </span>
	    </label>
	    <label>
	      Password: <input name="password" onChange={onChange}>
	      <br/>
	      <span class="error">
	        {this.state.errors.password}
	      </span>
	    </label>  
	  </form>
	);
      }
    }
    ~~~

    Your answer should list outright bugs as well as usability and
    maintainability issues. "${POINTS}-points"


  `;
  return text;
}

function explain(params) {
  let text = '';
  text += `

      + The \`onChange()\` and \`onSubmit()\` handlers have an
        incorrect \`this\`.  The usual idiom is to add:

        ~~~
	this.onChange = this.onChange.bind(this);
	this.onSubmit = this.onSubmit.bind(this);
	~~~

        to the constructor.

      + The \`input\` control for \`password\` should have the \`type\`
        attribute set to \`password\` so that passwords are not echoed.

      + When updating the state in the \`onChange()\` handler, the line
      	\`this.state.name = value\` should be \`this.state[name] =
      	value\`.

      + In \`render()\`, \`formErrors\` is a list of jsx elements;
        to avoid warnings, each list element should be given
	a unique id (the index in the list would be sufficient).

      + Error messages are not reset after the user may have
        fixed the problem causing them.

      + Signalling an error on every widget change will be very
        distracting.  It would be best to move the validation
	code from the \`onChange()\` handler into a \`onBlur()\`
	handler.  So the \`onChange()\` handler would merely
	update the state.
 
      + The validation for email merely checks whether \`email\`
        contains a \`@\` and will pass even if the \`@\` is at
	the beginning or the end.  This should be tightened up
	using a regex like \`/^.+@.+$/\`.

      + The validation for the \`password\` field is not at all
        close to meeting the specifications laid out in the
	error message.  The regex limits the password to
	exactly 8 characters, it should be 8 or more.  The
	special characters should be checked individually.
	So a validation test could be something like:

	~~~
	password.length >= 8 &&
	password.match(/[A-Z]/) &&
	password.match(/\d/)
	~~~

    Identifying around 5 of these problems should be sufficient to
    get full credit for this question.                  

  `;
  return text;
}


if (process.argv[1] === __filename) {
  console.log(new ReactLogin().qaText());
}
