import React from 'react';
import { Link } from 'react-router-dom';
import DeleteCommentButton from './DeleteCommentButton';
import EditCommentButton from './EditCommentButton';
import fire from './config/Fire';
import EditComment from './EditComment';
export default class CommentTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editComment: false,
        }
    }

    editComment = (value) => {
        this.setState({ editComment: value })
    }

    markAsEdited = () => {
        fire.firestore().collection('comments').doc(this.props.comment.id).update({ edited: true });
    }

    generateComment = () => {
        const comment = this.props.comment;
        let currentUserComment = false;
        if (this.props.user && this.props.user.displayName === comment.data().creator) {
            currentUserComment = true;
        }
        return (
            <div key={comment.id} className='comment'>
                <div className='commentPoints'>{comment.data().points}</div>
                <Link to={`/profile/${comment.data().creator}`}>{comment.data().creator}</Link>
                {this.state.editComment ? <EditComment updateComments={this.props.updateComments} editComment={this.editComment} markAsEdited={this.markAsEdited} docId={comment.id} /> : <p>{comment.data().text}</p>}
                {currentUserComment ? <EditCommentButton editComment={this.editComment}/> : null}
                {currentUserComment ? <DeleteCommentButton updateComments={this.props.updateComments} commentId={comment.id} /> : null}
            </div>
        )
    }

    render() {
        return (
            this.generateComment()
        );
    }
}