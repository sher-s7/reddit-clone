import React from 'react';
import { Link } from 'react-router-dom';
import DeleteCommentButton from './DeleteCommentButton';
import EditCommentButton from './EditCommentButton';
import fire from './config/Fire';
import EditComment from './EditComment';
import VoteButton from './VoteButton';
import { formatDistanceToNow } from 'date-fns';
import NewComment from './NewComment';
export default class CommentTemplate extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            editComment: false,
            reply: false,
            hideReplies: false
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if (!this.props.profile) this.fetchNestedComments();
    }

    fetchNestedComments = () => {
        fire.firestore().collection('comments').where('directParent', '==', this.props.comment.id).get().then(replies => {
            if (!replies.empty) {
                this.setState({ replies: replies.docs })
            } else {
                this.setState({ lastReply: true, replies: [] })
            }
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    editComment = (value) => {
        this.setState({ editComment: value })
    }

    markAsEdited = () => {
        fire.firestore().collection('comments').doc(this.props.comment.id).update({ edited: true });
    }

    showReplyBox = (bool) => {
        this.setState({ reply: bool })
    }

    generateComment = () => {
        const comment = this.props.comment;
        const parents = comment.data().parents || [];
        const nestDepth = comment.data().nestDepth;
        let currentUserComment = false;
        if (this.props.user && this.props.user.displayName === comment.data().creator) {
            currentUserComment = true;
        }

        if (this.props.profile) {
            fire.firestore().collection('posts').doc(comment.data().postId).get().then(postRef => {
                if(this._isMounted) this.setState({post: postRef})
            })
            return (
                <div key={comment.id} className={'comment'}>
                    <VoteButton collection='comments' doc={this.props.comment} />
                    {this.state.post ? <div>Commented on <Link to={`/group/${this.state.post.data().group}/post/${this.state.post.id}`}>{this.state.post.data().title}</Link> in <Link to={`/group/${this.state.post.data().group}`}>{this.state.post.data().group}</Link></div> : 'loading'}
                    <span className='distanceInWords'>{formatDistanceToNow(comment.data().dateCreated.toDate(),
                        { addSuffix: true })}</span>
                    {comment.data().edited ? <span>(edited)</span> : null}
                    <div>{comment.data().text}</div>
                </div>
            )
        } else {
            return (
                <div key={comment.id} className={`comment${nestDepth > 0 ? ' indent' : ''}`}>
                    <VoteButton collection='comments' doc={this.props.comment} />
                    <Link to={`/profile/${comment.data().creator}`}>{comment.data().creator}</Link>
                    <span className='distanceInWords'>{formatDistanceToNow(comment.data().dateCreated.toDate(),
                        { addSuffix: true })}</span>
                    {comment.data().edited ? <span>(edited)</span> : null}
                    {this.state.editComment ? <EditComment updateComments={this.props.updateComments} editComment={this.editComment} markAsEdited={this.markAsEdited} docId={comment.id} /> : <p>{comment.data().text}</p>}
                    {nestDepth >= 4 ? null : <button onClick={() => this.showReplyBox(true)}>Reply</button>}

                    {currentUserComment ? <EditCommentButton editComment={this.editComment} /> : null}
                    {currentUserComment ? <DeleteCommentButton updateComments={this.props.updateComments} commentId={comment.id} postId={this.props.postId} /> : null}

                    {this.state.reply ? <NewComment user={this.props.user} updateComments={this.fetchNestedComments} postId={this.props.postId} directParent={comment.id} parents={[...parents, comment.id]} highestParent={comment.data().highestParent || comment.id} nestDepth={nestDepth + 1} showReplyBox={this.showReplyBox} /> : null}
                    {!this.state.lastReply ? <div className='showMore' onClick={() => this.setState(prevState => {
                        return {
                            hideReplies: !prevState.hideReplies
                        }
                    })}><button className={this.state.hideReplies ? 'closed' : 'open'} >{this.state.hideReplies ? 'View more replies' : null}</button></div> : null}
                    <div className={`replies ${this.state.hideReplies ? 'hidden' : null}`}>
                        {this.state.replies ? this.state.replies.map(reply =>
                            <CommentTemplate user={this.props.user} key={reply.id} updateComments={this.fetchNestedComments} highestParent={reply.data().highestParent} comment={reply} postId={this.props.postId} />
                        ) : null}
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            this.generateComment()
        );
    }
}