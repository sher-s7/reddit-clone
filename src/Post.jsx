import React from 'react';
import fire from './config/Fire';
import NewComment from './NewComment';
import CommentTemplate from './CommentTemplate';
import PostTemplate from './PostTemplate';
import { withRouter } from 'react-router-dom';
class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editPost: false,
            edited: false,
            newComments: [],
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
            if (postRef.exists) {
                this.setState({ post: postRef, user: fire.auth().currentUser })
            }else {
                this.props.history.push('/');
            }
        })
    }

    setNewComment = (comment) => {
        this.setState(prevState => ({ newComments: [comment, ...prevState.newComments] }));
    }


    render() {

        return (
            this.state.post && this.state.comments ? (
                <div className='postPage'>

                    <PostTemplate updatePosts={this.updatePost} redirect={true} post={this.state.post} user={this.state.user} />
                    <div className='comments'>
                        <div>Comments</div>
                        {this.props.currentUser ? <NewComment user={this.state.user} getNewComment={this.getNewComment} setNewComment={this.setNewComment} updateComments={this.updateComments} postId={this.props.postId} /> : <div>Log in or Sign up to comment</div>}
                        {this.state.newComments.map(comment => comment)}
                        {this.state.comments.map(comment => (
                            <CommentTemplate user={this.state.user} key={comment.id} updateComments={this.updateComments} comment={comment} />
                        ))}
                    </div>
                </div>
            ) : <span>Loading</span>
        );
    }
}

export default withRouter(Post);