import React from 'react';
import fire from './config/Fire';

export default class CurrentUserProfile extends React.Component {
    render() {
        return (
            <div>
                <img src={this.props.user.photoURL} alt="profile picture"/>
               {this.props.user.displayName}'s profile
                
            </div>
        );
    }
}


