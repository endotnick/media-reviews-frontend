import React from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { authenticate } from '../redux/actions/AuthActions';
import ErrorComponent from '../components/ErrorComponent';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const {name, value} = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.authenticate(this.state)
    .then(response => {
      if (response.hasOwnProperty('errors')) {
        throw response.errors;
      } else {
        this.props.history.push(`/users/${response.id}`)
        console.log('login returned true.')
      }
    })
    .catch(errors => {
      console.log('login returned false.')
      this.setState({       
        errors: [errors.message]
      });
      console.log(this.state.errors)
    })
  }

  render() {
    return (
      <React.Fragment>
        <h2>Login!</h2> 
        <form onSubmit={this.handleSubmit}>
          <ErrorComponent errors={this.state.errors} />
          <label>
            Email:
            <input type='text' name='email' value={this.state.email} onChange={this.handleChange} />
          </label>
          <label>
            Password:
            <input type='password' name='password' value={this.state.password} onChange={this.handleChange} />
          </label>
          <input type='submit' value='Submit' />
        </form>
      </React.Fragment>
    );
  }
}

export default LoginForm = withRouter(connect(null, { authenticate })(LoginForm));
