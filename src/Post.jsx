import React from 'react';
import fire from './config/Fire';
import NewComment from './NewComment';
import CommentTemplate from './CommentTemplate';
import PostTemplate from './PostTemplate';
import { withRouter } from 'react-router-dom';
import GroupInfo from './GroupInfo';

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
        
        fire.firestore().collection('comments').where('postId', '==', this.props.postId).orderBy('points', 'desc').get().then(commentsData => {
            this.setState({ comments: commentsData.docs })
            fire.firestore().collection('posts').doc(this.props.postId).update({
                commentCount: commentsData.docs.length
            });
        });
    }

    updatePost = () => {
        
        fire.firestore().collection('posts').doc(this.props.postId).get().then(postRef => {
            if (postRef.exists) {
                
                this.setState({ post: postRef, user: fire.auth().currentUser })
            } else {
                
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
                    {this.state.post && this.state.post.data() ? <GroupInfo group={this.state.post.data().group} currentUser={this.props.currentUser}/> : null}
                    <div className='comments'>
                        <div id='commentsHeader'>COMMENTS</div>
                        {this.props.currentUser ? <NewComment user={this.state.user} updateComments={this.updateComments} postId={this.props.postId} parents={null} directParent={null} nestDepth={0} highestParent={null} /> : <div>Log in or Sign up to comment</div>}
                        <div className='commentsList'>
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
                </div>
            ) : null
        );
    }
}

export default withRouter(Post);