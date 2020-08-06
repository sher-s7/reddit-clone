import React from 'react';
import { Link } from 'react-router-dom';
import DeleteCommentButton from './DeleteCommentButton';
export default class CommentTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
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
                <p>{comment.data().text}</p>
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