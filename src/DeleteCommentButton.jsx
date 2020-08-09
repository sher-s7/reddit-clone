import React from 'react';
import fire from './config/Fire';
import firebase from 'firebase/app';
export default class DeleteCommentButton extends React.Component {

    handleClick = () => {
        let confirm = window.confirm("Are you sure you want to delete this comment?");
        if (confirm) {
            fire.firestore().collection('comments').doc(this.props.commentId).get().then(commentRef => {
                fire.firestore().collection('posts').doc(commentRef.data().postId).update({
                    commentCount: firebase.firestore.FieldValue.increment(-1)
                }).then(fire.firestore().collection('comments').doc(this.props.commentId).delete().then(this.props.updateComments))
            })
            
        }
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                Delete
            </button>
        );
    }
}