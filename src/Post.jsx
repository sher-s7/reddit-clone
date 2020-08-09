import React from 'react';
import fire from './config/Fire';
import NewComment from './NewComment';
import CommentTemplate from './CommentTemplate';
import EditPost from './EditPost';
import EditPostButton from './EditPostButton';
import DeletePostButton from './DeletePostButton';
import { Link } from 'react-router-dom';
export default class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editPost: false,
            edited: false
        }
    }

    componentDidMount = () => {
        fire.firestore().collection('posts').doc(this.props.postId).get().then(docRef => {
            this.setState({ post: docRef.data(), user: fire.auth().currentUser, postId: docRef.id })
        });
        this.updateComments();
    }

    editPost = (value) => {
        this.setState({ editPost: value })
    }

    markAsEdited = () => {
        fire.firestore().collection('posts').doc(this.state.postId).update({ edited: true });
    }

    updatePost = () => {
        fire.firestore().collection('posts').doc(this.props.postId).get().then(docRef => {
            this.setState({ post: docRef.data() })
        });
    }

    displayPost = () => {
        const currentUserPost = this.props.currentUser && this.props.currentUser.uid === this.state.post.uid ? true : false;
        const post = this.state.post;
        if (post.type === 'text') {
            return (
                <div className='post'>
                    <span>Posted by <Link to={`/profile/${this.state.post.username}`}>{this.state.post.username}</Link></span>
                    <h3>{post.title}</h3>
                    {this.state.post.edited ? <span className='edited'>(edited)</span> : null}
                    {this.state.editPost ? <EditPost updatePosts={this.updatePost} editPost={this.editPost} markAsEdited={this.markAsEdited} docId={this.state.postId} /> : <p>{post.body}</p>}
                    {currentUserPost ? <EditPostButton editPost={this.editPost} /> : null}
                    {currentUserPost ? <DeletePostButton redirect={true} updatePosts={this.updatePost} docId={this.state.postId} /> : null}
                </div>
            );
        } else if (post.type === 'image') {
            return (
                <div className='post'>
                    <span>Posted by <Link to={`/profile/${this.state.post.username}`}>{this.state.post.username}</Link></span>
                    <h3>{post.title}</h3>
                    <img width='290px' src={post.image} alt='post img' />
                    {currentUserPost ? <DeletePostButton redirect={true} updatePosts={this.updatePost} docId={this.state.postId} /> : null}
                </div>
            )
        } else if (post.type === 'link') {
            return (
                <div className='post'>
                    <span>Posted by <Link to={`/profile/${this.state.post.username}`}>{this.state.post.username}</Link></span>
                    <a target='_blank' rel="noopener noreferrer" href={post.link}>{post.title}</a>
                    {currentUserPost ? <DeletePostButton redirect={true} updatePosts={this.updatePost} docId={this.state.postId} /> : null}
                </div>
            )
        }
    }

    updateComments = () => {
        fire.firestore().collection('comments').where('postId', '==', this.props.postId).orderBy('points', 'desc').get().then(commentsData => {
            this.setState({ comments: commentsData.docs })
        });
    }

    render() {
        return (
            this.state.post && this.state.comments ? (
                <div className='postPage'>
                    {this.displayPost()}
                    <div className='comments'>
                        <div>Comments</div>
                        {this.props.currentUser ? <NewComment updateComments={this.updateComments} postId={this.props.postId} /> : <div>Log in or Sign up to comment</div>}
                        {this.state.comments.map(comment => (
                            <CommentTemplate user={this.state.user} key={comment.id} updateComments={this.updateComments} comment={comment} />
                        ))}
                    </div>
                </div>
            ) : <span>Loading</span>

        );
    }
}