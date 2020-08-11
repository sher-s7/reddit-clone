import React from 'react';
import fire from './config/Fire';
import firebase from 'firebase/app';
import NewComment from './NewComment';
import CommentTemplate from './CommentTemplate';
import EditPost from './EditPost';
import EditPostButton from './EditPostButton';
import DeletePostButton from './DeletePostButton';
import { Link } from 'react-router-dom';
import PostTemplate from './PostTemplate';
export default class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editPost: false,
            edited: false
        }
    }

    componentDidMount = () => {
        fire.firestore().collection('posts').doc(this.props.postId).get().then(postRef => {
            this.setState({ post: postRef, user: fire.auth().currentUser })
        })
        this.updateComments();
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

                    <PostTemplate post={this.state.post} user={this.state.user} />
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