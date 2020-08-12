import React from 'react';
import fire from './config/Fire';

import { withRouter } from 'react-router-dom';

class CurrentUserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        }
    }

    componentDidMount() {
        fire.firestore().collection('users').where('username', '==', this.props.userId).get().then(userSnapshot => {
            if (userSnapshot.docs.length > 0) {
                this.setState({ user: userSnapshot.docs[0] })
            }
        })
    }

    componentDidUpdate(prevProps) {
        
        if (prevProps.userId !== this.props.userId) {
            fire.firestore().collection('users').where('username', '==', this.props.userId).get().then(userSnapshot => {
                if (userSnapshot.docs.length > 0) {
                    if (this.state.user !== userSnapshot.docs[0]) {
                        this.setState({ user: userSnapshot.docs[0] })
                    }
                }
            })
        }
    }

    render() {

        return (
            this.state.user === null ?
                <div>user not found</div>
                :
                <div>
                    <img src={this.state.user.data().photoUrl} alt="profile pic" />
                    <span>{this.state.user.data().username}'s profile</span>
                </div>

        );
    }
}

export default withRouter(CurrentUserProfile);


