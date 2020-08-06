import React from 'react';
import fire from './config/Fire';
export default class DeleteCommentButton extends React.Component {

    handleClick = () => {
        let confirm = window.confirm("Are you sure you want to delete this comment?");
        if (confirm) {
            fire.firestore().collection('comments').doc(this.props.commentId).delete().then(this.props.updateComments)
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