import React from 'react';
import fire from './config/Fire';

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            error: '',
        }

        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    login = (e) => {
        e.preventDefault();
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(userData => {
            console.log('User id', userData.user.uid);
        }).catch(error => {
            console.log(error)
            this.setState({ error })
        });
    }

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }
 
  render() {
  return (
    <div id='loginModal'>
        <form onSubmit={this.login}>
            <label htmlFor="username">
                Username:
                <input value={this.state.username} onChange={this.handleChange} type="text" name="username" id="usernameField"/>
            </label>
            <label htmlFor="email">
                Email:
                <input value={this.state.email} onChange={this.handleChange} type="email" name="email" id="emailField"/>
            </label>
            <label htmlFor="password">
                Password:
                <input value={this.state.password} onChange={this.handleChange} type="password" name="password" id="passwordField"/>
            </label>
            <input type="submit" value="Login"/>
            
        </form>
    </div>
  );
}
}


