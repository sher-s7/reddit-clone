import React from 'react';
import fire from './config/Fire';
import firebase from 'firebase/app';
import { withRouter, Link } from 'react-router-dom';
class GroupInfo extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            joined: false,
        }
    }

    componentDidMount() {
        this._isMounted = true;
        fire.firestore().collection('groups').doc(this.props.group).get().then(groupRef => {
            if (this._isMounted && groupRef.data()) {
                this.setState({ numberOfUsers: groupRef.data().numberOfUsers, description: groupRef.data().description });
            } else {
                this.props.history.push('/');
            }
        });
        this.updateJoinButton(this.props.currentUser);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentUser !== this.props.currentUser) {
            this.updateJoinButton(this.props.currentUser);
        }
        if (this._isMounted && (prevProps.group !== this.props.group)) {
            fire.firestore().collection('groups').doc(this.props.group).get().then(groupRef => {
                this.setState({ numberOfUsers: groupRef.data().numberOfUsers, description: groupRef.data().description });
            });
        }
    }

    updateJoinButton = (user) => {
        this.setState({ currentUser: user })
        if (this._isMounted && user) {
            fire.firestore().collection('users').doc(user.uid).get().then(userRef => {

                if (userRef.exists && userRef.data().joinedGroups.includes(this.props.group)) {
                    this.setState({
                        joined: true
                    });
                } else {
                    this.setState({
                        joined: false
                    });
                }
            })
        }
    }

    joinGroup = () => {
        if (this.state.currentUser) {
            fire.firestore().collection('users').doc(this.state.currentUser.uid).update({
                joinedGroups: firebase.firestore.FieldValue.arrayUnion(this.props.group)
            }).then(() => {
                this.setState({ joined: true })
                fire.firestore().collection('groups').doc(this.props.group).update({
                    numberOfUsers: firebase.firestore.FieldValue.increment(1)
                })
            })
                .catch(error => console.error(error));
        } else {
            alert('Must be logged in to join groups.');
        }
    }

    leaveGroup = () => {
        if (this.state.currentUser) {
            fire.firestore().collection('users').doc(this.state.currentUser.uid).update({
                joinedGroups: firebase.firestore.FieldValue.arrayRemove(this.props.group)
            }).then(() => {
                this.setState({ joined: false })
                fire.firestore().collection('groups').doc(this.props.group).update({
                    numberOfUsers: firebase.firestore.FieldValue.increment(-1)
                })
            })
                .catch(error => console.error(error));
        } else {
            alert('Must be logged in to perform this action.')
        }
    }

    pluralize = (word, num) => {
        return num !== 1 ? `${word}S` : word;
    }

    render() {
        return (
            <div className='groupHeaderContainer'>
                <h1 className='groupHeader'><Link to={`/group/${this.props.group}`}>{this.props.group}</Link></h1>
                {this.state.joined ? <button id='leaveGroup' onClick={this.leaveGroup}>LEAVE</button> : <button id='joinGroup' onClick={this.joinGroup}>JOIN</button>}
                {typeof this.state.numberOfUsers === 'number' ?
                    <span className='numMembers'><span className='number'>{this.state.numberOfUsers}</span> {this.pluralize('MEMBER', this.state.numberOfUsers)}</span>
                    : null}
                {this.state.description ? <h4 className='groupDescription'>{this.state.description}</h4> : null}
            </div>
        );
    }
}

export default withRouter(GroupInfo);