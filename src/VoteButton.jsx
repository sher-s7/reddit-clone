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
        fire.firestore().collection('posts').doc(this.props.post.id).get().then(postRef => {
            console.log(postRef.data().points)
            this.setState({ post: postRef, points: postRef.data().points, currentUser: user })
            if (user) {
                if (postRef.data().votes[user.uid] === 1) {
                    this.setState({ vote: 'upvoted' })
                } else if (postRef.data().votes[user.uid] === -1) {
                    this.setState({ vote: 'downvoted' })
                }
            }
        });
    }

    componentDidUpdate(_prevProps, prevState) {
        if (prevState.points !== this.state.points) {
            this.updatePost();
        }
    }


    updatePost = () => {
        fire.firestore().collection('posts').doc(this.props.post.id).get().then(postRef => {
            this.setState({ post: postRef })
        });
    }

    handleUpvote = () => {
        const currentUser = this.state.currentUser;
        const post = this.state.post;
        if (currentUser) {
            const votesMap = post.data().votes;
            const uid = currentUser.uid;
            if (votesMap[uid] === 1) {
                console.log('1 to 0')
                fire.firestore().collection('posts').doc(this.props.post.id).update({
                    votes: {
                        [uid]: 0
                    },
                    points: firebase.firestore.FieldValue.increment(-1)
                });
                this.setState((prevState) => ({
                    vote: '',
                    points: prevState.points - 1,
                }));
            } else if (votesMap[uid] === -1) {
                console.log('-1 to 1')
                fire.firestore().collection('posts').doc(this.props.post.id).update({
                    votes: {
                        [uid]: 1
                    },
                    points: firebase.firestore.FieldValue.increment(2)
                });
                this.setState((prevState) => ({
                    vote: 'upvoted',
                    points: prevState.points + 2,
                }));
            } else {
                console.log('0 to 1')
                fire.firestore().collection('posts').doc(this.props.post.id).update({
                    votes: {
                        [uid]: 1
                    },
                    points: firebase.firestore.FieldValue.increment(1)
                });
                this.setState((prevState) => ({
                    vote: 'upvoted',
                    points: prevState.points + 1,
                }));
            }
        } else {
            alert('Must be logged in to vote.')
        }
    }



    handleDownvote = () => {
        const currentUser = fire.auth().currentUser;
        const post = this.state.post;
        if (currentUser) {
            const votesMap = post.data().votes;
            const uid = currentUser.uid;
            if (votesMap[uid] === 1) {
                console.log('1 to -1')
                fire.firestore().collection('posts').doc(this.props.post.id).update({
                    votes: {
                        [uid]: -1
                    },
                    points: firebase.firestore.FieldValue.increment(-2)
                });
                this.setState((prevState) => ({
                    vote: 'downvoted',
                    points: prevState.points - 2,
                }));
            } else if (votesMap[uid] === -1) {
                console.log('-1 to 0')
                fire.firestore().collection('posts').doc(this.props.post.id).update({
                    votes: {
                        [uid]: 0
                    },
                    points: firebase.firestore.FieldValue.increment(1)
                });
                this.setState((prevState) => ({
                    vote: '',
                    points: prevState.points + 1,
                }));
            } else {
                console.log('0 to -1')
                fire.firestore().collection('posts').doc(this.props.post.id).update({
                    votes: {
                        [uid]: -1
                    },
                    points: firebase.firestore.FieldValue.increment(-1)
                });
                this.setState((prevState) => ({
                    vote: 'downvoted',
                    points: prevState.points - 1,
                }));
            }
        } else {
            alert('Must be logged in to vote.')
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