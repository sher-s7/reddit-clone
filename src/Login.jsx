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
        fire.firestore().collection('users').where('username', '==', this.state.username).get().then(userSnapshot => {
            if (userSnapshot.docs.length > 0) {
                this.setState({ email: userSnapshot.docs[0].data().email })
            } else {
                throw Error("User doesn't exist")
            }
        }).then(() => {
            fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(this.props.setModal)
            .catch(error => {
                console.error(error.message);
                this.setState({ error: error.message })
            });
        })
        .catch(error => {
            console.error(error.message);
            this.setState({ error: error.message })
        });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div id='loginModal'>
                <button onClick={this.props.setModal}> ╳ </button>
                <form onSubmit={this.login}>
                    <label htmlFor="username">
                        Username:
                <input required value={this.state.username} onChange={this.handleChange} type="text" name="username" id="usernameField" />
                    </label>
                    <label htmlFor="password">
                        Password:
                <input required value={this.state.password} onChange={this.handleChange} type="password" name="password" id="passwordField" />
                    </label>
                    <input type="submit" value="Login" />
                    <p>{this.state.error}</p>
                </form>
            </div>
        );
    }
}


