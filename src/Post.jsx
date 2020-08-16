import React from 'react';
import fire from './config/Fire';
import NewComment from './NewComment';
import CommentTemplate from './CommentTemplate';
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
        this.updatePost();
        this.updateComments();
    }

    updateComments = () => {
        fire.firestore().collection('comments').where('postId', '==', this.props.postId).orderBy('points', 'desc').get().then(commentsData => {
            this.setState({ comments: commentsData.docs })
        });
    }

    updatePost = () => {
        fire.firestore().collection('posts').doc(this.props.postId).get().then(postRef => {
            this.setState({ post: postRef, user: fire.auth().currentUser })
        })
    }

    render() {

        return (
            this.state.post && this.state.comments ? (
                <div className='postPage'>

                    <PostTemplate updatePosts={this.updatePost} redirect={true} post={this.state.post} user={this.state.user} />
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