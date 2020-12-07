import React from 'react';
import fire from '../config/Fire';
import NewComment from '../Components/Comments/NewComment';
import CommentTemplate from '../Components/Comments/CommentTemplate';
import PostTemplate from '../Components/Posts/PostTemplate';
import { withRouter } from 'react-router-dom';
import GroupInfo from '../Components/Groups/GroupInfo';

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
            let comments = commentsData.docs;
            let commentsByNestDepth = [[], [], [], [], []];
            for (let i = 0; i < 5; i++) {
                commentsByNestDepth[i] = comments.filter(comment => comment.data().nestDepth === i);
            }
            let serializedComments = []
            commentsByNestDepth.forEach((arr, index) => {
                index === 0 ?
                    serializedComments.push(...arr) :
                    arr.sort((a, b) => a.data().points > b.data().points).forEach(comment => {
                        const insertAt = serializedComments.findIndex(parent => parent.id === comment.data().directParent);
                        serializedComments.splice(insertAt + 1, 0, comment)
                    })
            })
            this.setState({ comments: serializedComments })
            fire.firestore().collection('posts').doc(this.props.postId).update({
                commentCount: commentsData.docs.length
            }).catch(error => console.warn(error.message, 'Must log in.'));
        }).catch(error => console.warn(error.message, 'Must log in.'));
    }


    updatePost = () => {

        fire.firestore().collection('posts').doc(this.props.postId).get().then(postRef => {
            if (postRef.exists) {

                this.setState({ post: postRef, user: fire.auth().currentUser })
            } else {

                this.props.history.push('/');
            }
        }).then(this.props.hideLoader).catch(error => console.warn(error.message, 'Must log in.'));
    }



    render() {

        return (
            this.state.post && this.state.comments ? (
                <div className='postPage'>
                    <div className='post'>
                        <PostTemplate updatePosts={this.updatePost} post={this.state.post} user={this.state.user} />
                    </div>
                    {this.state.post && this.state.post.data() ? <GroupInfo group={this.state.post.data().group} currentUser={this.props.currentUser} /> : null}
                    <div className='comments'>
                        <div id='commentsHeader'>COMMENTS</div>
                        {this.props.currentUser ? <NewComment user={this.state.user} updateComments={this.updateComments} postId={this.props.postId} parents={null} directParent={null} nestDepth={0} highestParent={null} /> : <div>Log in or Sign up to comment</div>}
                        <div className='commentsList'>
                            {this.state.comments.map(comment => (
                                <CommentTemplate
                                    user={this.state.user}
                                    key={comment.id}
                                    updateComments={this.updateComments}
                                    comment={comment}
                                    postId={this.props.postId} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : null
        );
    }
}

export default withRouter(Post);