import React from 'react';
import fire from '../../config/Fire';

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
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('touchstart', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('touchstart', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.props.setModal();
        }
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
            .then(this.props.updateView)
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
            <div ref={this.wrapperRef} id='loginModal'>
                <button className='closeModal' onClick={() => this.props.setModal(null)}> ╳ </button>
                <h2>LOGIN</h2>
                <form onSubmit={this.login}>
                    <label htmlFor="username">
                        Username:
                <input required value={this.state.username} onChange={this.handleChange} type="text" name="username" id="usernameField" />
                    </label>
                    <label htmlFor="password">
                        Password:
                <input required value={this.state.password} onChange={this.handleChange} type="password" name="password" id="passwordField" />
                    </label>
                    <input type="submit" value="LOGIN" />
                    <p>{this.state.error}</p>
                </form>
            </div>
        );
    }
}


