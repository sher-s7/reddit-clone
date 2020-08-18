import React from 'react';
import fire from './config/Fire';
import firebase from 'firebase/app'
import CommentTemplate from './CommentTemplate';
export default class NewComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: '',
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const currentUser = fire.auth().currentUser;
        if (!currentUser) {
            alert('Must be logged in to post')
        } else {
            fire.firestore().collection('comments').add({
                points: 0,
                creator: currentUser.displayName,
                text: this.state.comment,
                dateCreated: new Date(),
                postId: this.props.postId,
                votes: {}
            }).then((docRef) => {
                this.setState({ comment: '' });
                docRef.get().then(comment => {
                    this.props.setNewComment(<CommentTemplate user={this.props.user} key={comment.id} updateComments={this.props.updateComments} comment={comment} />)
                });
                
            }).then(
                fire.firestore().collection('posts').doc(this.props.postId).update({ commentCount: firebase.firestore.FieldValue.increment(1) })
            );
        }
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit} className='newCommentForm'>
                <textarea value={this.state.comment} name='comment' onChange={this.handleChange} id="commentTextArea" />
                <input type="submit" value="Submit comment" />
            </form>
        );
    }
}