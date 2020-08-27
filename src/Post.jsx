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
        this.props.showLoader();
        this.updatePost();
        this.updateComments();
    }

    updateComments = () => {
        console.log('updating')
        fire.firestore().collection('comments').where('postId', '==', this.props.postId).orderBy('points', 'desc').get().then(commentsData => {
            this.setState({ comments: commentsData.docs })
            fire.firestore().collection('posts').doc(this.props.postId).update({
                commentCount: commentsData.docs.length
            });
        });
    }

    updatePost = () => {
        console.log('updatepost')
        fire.firestore().collection('posts').doc(this.props.postId).get().then(postRef => {
            if (postRef.exists) {
                console.log('still exists??')
                this.setState({ post: postRef, user: fire.auth().currentUser })
            } else {
                console.log('heh')
                this.props.history.push('/');
            }
        }).then(this.props.hideLoader);
    }


    render() {

        return (
            this.state.post && this.state.comments ? (
                <div className='postPage'>
                    <div className='post'>
                        <PostTemplate updatePosts={this.updatePost} post={this.state.post} user={this.state.user} />
                    </div>
                    <div className='comments'>
                        <div id='commentsHeader'>COMMENTS</div>
                        {this.props.currentUser ? <NewComment user={this.state.user} updateComments={this.updateComments} postId={this.props.postId} parents={null} directParent={null} nestDepth={0} highestParent={null} /> : <div>Log in or Sign up to comment</div>}
                        {this.state.comments.map(comment => (
                            comment.data().nestDepth === 0 ?
                                <CommentTemplate
                                    user={this.state.user}
                                    key={comment.id}
                                    updateComments={this.updateComments}
                                    comment={comment}
                                    postId={this.props.postId} />
                                : null
                        ))}
                    </div>
                </div>
            ) : null
        );
    }
}

export default withRouter(Post);