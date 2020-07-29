import React from 'react';
import fire from './config/Fire';

export default class Profile extends React.Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
    }

    logout() {
        fire.auth().signOut();
        this.props.authListener();
    }

    render() {
        return (
            <div>
               {this.props.user.displayName}'s profile
                <button onClick={this.logout}>Logout</button>
            </div>
        );
    }
}


