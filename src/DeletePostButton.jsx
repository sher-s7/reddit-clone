import React from 'react';
import fire from './config/Fire';
export default class DeletePostButton extends React.Component {

    handleClick = () => {
        let confirm = window.confirm("Are you sure you want to delete this post?");
        if (confirm) {
            fire.firestore().collection('posts').doc(this.props.docId).delete().then(this.props.updatePosts)
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