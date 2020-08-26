import React from 'react';
import fire from './config/Fire';
import firebase from 'firebase/app';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp as upVote } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown as downVote } from '@fortawesome/free-solid-svg-icons';
export default class VoteButton extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            vote: '',
            disabled: false,
            voteDelay: 500,
        }
    }

    componentDidMount() {
        this._isMounted = true;
        const user = fire.auth().currentUser;
        fire.firestore().collection(this.props.collection).doc(this.props.doc.id).get().then(docRef => {
            if (this._isMounted && docRef.data()) {
                this.setState({ doc: docRef, points: docRef.data().points, currentUser: user })
                if (user) {
                    if (docRef.data().votes[user.uid] === 1 && this._isMounted) {
                        this.setState({ vote: 'upvoted' })
                    } else if (docRef.data().votes[user.uid] === -1 && this._isMounted) {
                        this.setState({ vote: 'downvoted' })
                    }
                }
            }
        });
    }

    componentDidUpdate(_prevProps, prevState) {
        console.log('vote loop check')
        if (prevState.points !== this.state.points) {
            console.log('vote inner loop')
            this.updateDoc();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    updateDoc = () => {
        fire.firestore().collection(this.props.collection).doc(this.props.doc.id).get().then(docRef => {
            if (this._isMounted) {
                this.setState({ doc: docRef })
            }
        });
    }

    handleUpvote = () => {
        const currentUser = this.state.currentUser;
        const doc = this.state.doc;
        this.setState({ upClick: true })
        setTimeout(() => {
            this.setState({ upClick: false })
        }, 600);
        if (currentUser) {
            this.setState({ disabled: true });
            const votesMap = doc.data().votes;
            const uid = currentUser.uid;
            if (votesMap[uid] === 1) {

                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: 0
                    },
                    points: firebase.firestore.FieldValue.increment(-1)
                }, { merge: true }).then(() => {
                    this.setState((prevState) => ({
                        vote: '',
                        points: prevState.points - 1,

                    }));
                    setTimeout(() => {
                        this.setState({ disabled: false })
                    }, this.state.voteDelay);
                }
                );

            } else if (votesMap[uid] === -1) {

                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: 1
                    },
                    points: firebase.firestore.FieldValue.increment(2)
                }, { merge: true }).then(() => {
                    this.setState((prevState) => ({
                        vote: 'upvoted',
                        points: prevState.points + 2,

                    }));
                    setTimeout(() => {
                        this.setState({ disabled: false })
                    }, this.state.voteDelay);
                });

            } else {

                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: 1
                    },
                    points: firebase.firestore.FieldValue.increment(1)
                }, { merge: true }).then(() => {
                    this.setState((prevState) => ({
                        vote: 'upvoted',
                        points: prevState.points + 1,

                    }));
                    setTimeout(() => {
                        this.setState({ disabled: false })
                    }, this.state.voteDelay);
                });
            }
        } else {
            alert('Must be logged in to vote')
        }
    }



    handleDownvote = () => {
        const currentUser = fire.auth().currentUser;
        const doc = this.state.doc;
        this.setState({ downClick: true })
        setTimeout(() => {
            this.setState({ downClick: false })
        }, 600);
        if (currentUser) {
            this.setState({ disabled: true });
            const votesMap = doc.data().votes;
            const uid = currentUser.uid;
            if (votesMap[uid] === 1) {

                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: -1
                    },
                    points: firebase.firestore.FieldValue.increment(-2)
                }, { merge: true }).then(() => {
                    this.setState((prevState) => ({
                        vote: 'downvoted',
                        points: prevState.points - 2,

                    }));
                    setTimeout(() => {
                        this.setState({ disabled: false })
                    }, this.state.voteDelay);
                });
            } else if (votesMap[uid] === -1) {

                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: 0
                    },
                    points: firebase.firestore.FieldValue.increment(1)
                }, { merge: true }).then(() => {

                    this.setState((prevState) => ({
                        vote: '',
                        points: prevState.points + 1,

                    }));
                    setTimeout(() => {
                        this.setState({ disabled: false })
                    }, this.state.voteDelay);
                });
            } else {
                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: -1
                    },
                    points: firebase.firestore.FieldValue.increment(-1)
                }, { merge: true }).then(() => {

                    this.setState((prevState) => ({
                        vote: 'downvoted',
                        points: prevState.points - 1,

                    }));
                    setTimeout(() => {
                        this.setState({ disabled: false })
                    }, this.state.voteDelay);
                });
            }
        } else {
            alert('Must be logged in to vote')
        }
    }

    render() {
        return (
            <div className={`points ${this.state.vote}`}>
                <button disabled={this.state.disabled} className={`upvote ${this.state.upClick ? 'clicked' : ''}`} onClick={this.handleUpvote}><FontAwesomeIcon icon={upVote} /></button>
                <span>{this.state.points !== null ? this.state.points : ''}</span>
                <button disabled={this.state.disabled} className={`downvote ${this.state.downClick ? 'clicked' : ''}`} onClick={this.handleDownvote}><FontAwesomeIcon icon={downVote} /></button>
            </div>
        );
    }
}