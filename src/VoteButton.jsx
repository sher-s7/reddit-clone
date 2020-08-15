import React from 'react';
import fire from './config/Fire';
import firebase from 'firebase/app';
export default class VoteButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vote: '',
        }
    }

    componentDidMount() {
        const user = fire.auth().currentUser;
        fire.firestore().collection(this.props.collection).doc(this.props.doc.id).get().then(docRef => {
            
            this.setState({ doc: docRef, points: docRef.data().points, currentUser: user })
            if (user) {
                if (docRef.data().votes[user.uid] === 1) {
                    this.setState({ vote: 'upvoted' })
                } else if (docRef.data().votes[user.uid] === -1) {
                    this.setState({ vote: 'downvoted' })
                }
            }
        });
    }

    componentDidUpdate(_prevProps, prevState) {
        if (prevState.points !== this.state.points) {
            this.updateDoc();
        }
    }


    updateDoc = () => {
        fire.firestore().collection(this.props.collection).doc(this.props.doc.id).get().then(docRef => {
            this.setState({ doc: docRef })
        });
    }

    handleUpvote = () => {
        const currentUser = this.state.currentUser;
        const doc = this.state.doc;
        if (currentUser) {
            const votesMap = doc.data().votes;
            const uid = currentUser.uid;
            if (votesMap[uid] === 1) {
                
                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: 0
                    },
                    points: firebase.firestore.FieldValue.increment(-1)
                }, {merge: true});
                this.setState((prevState) => ({
                    vote: '',
                    points: prevState.points - 1,
                }));
            } else if (votesMap[uid] === -1) {
                
                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: 1
                    },
                    points: firebase.firestore.FieldValue.increment(2)
                }, {merge: true});
                this.setState((prevState) => ({
                    vote: 'upvoted',
                    points: prevState.points + 2,
                }));
            } else {
                
                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: 1
                    },
                    points: firebase.firestore.FieldValue.increment(1)
                }, {merge: true});
                this.setState((prevState) => ({
                    vote: 'upvoted',
                    points: prevState.points + 1,
                }));
            }
        } else {
            alert('Must be logged in to vote')
        }
    }



    handleDownvote = () => {
        const currentUser = fire.auth().currentUser;
        const doc = this.state.doc;
        if (currentUser) {
            const votesMap = doc.data().votes;
            const uid = currentUser.uid;
            if (votesMap[uid] === 1) {
                
                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: -1
                    },
                    points: firebase.firestore.FieldValue.increment(-2)
                }, {merge: true});
                this.setState((prevState) => ({
                    vote: 'downvoted',
                    points: prevState.points - 2,
                }));
            } else if (votesMap[uid] === -1) {
                
                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: 0
                    },
                    points: firebase.firestore.FieldValue.increment(1)
                }, {merge: true});
                this.setState((prevState) => ({
                    vote: '',
                    points: prevState.points + 1,
                }));
            } else {
                
                fire.firestore().collection(this.props.collection).doc(this.props.doc.id).set({
                    votes: {
                        [uid]: -1
                    },
                    points: firebase.firestore.FieldValue.increment(-1)
                }, {merge: true});
                this.setState((prevState) => ({
                    vote: 'downvoted',
                    points: prevState.points - 1,
                }));
            }
        } else {
            alert('Must be logged in to vote')
        }
    }

    render() {
        return (
            <div className={`points ${this.state.vote}`}>
                <button className='upvote' onClick={this.handleUpvote}><i className="las la-chevron-up"></i></button>
                <span>{this.state.points !== null ? this.state.points : ''}</span>
                <button className='downvote' onClick={this.handleDownvote}><i className="las la-chevron-down"></i></button>
            </div>
        );
    }
}