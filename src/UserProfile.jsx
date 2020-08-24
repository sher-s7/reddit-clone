import React from 'react';
import fire from './config/Fire';
import { format } from 'date-fns';

import { withRouter, Link } from 'react-router-dom';
import PostTemplate from './PostTemplate';
import CommentTemplate from './CommentTemplate';

class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
        }
    }

    componentDidMount() {

        this.updateView();
    }

    componentDidUpdate(prevProps) {
        console.log('update check')
        if (prevProps.userId !== this.props.userId) {
            this.updateView();
        }
    }



    updateView = () => {
        console.log('user mounted')
        fire.firestore().collection('users').where('username', '==', this.props.userId).get().then(userSnapshot => {
            console.log(userSnapshot.docs.length)
            if (userSnapshot.docs.length > 0) {
                this.setState({ user: userSnapshot.docs[0], accountCreated: format(userSnapshot.docs[0].data().accountCreated.toDate(), 'MMM dd, yyyy') })
                fire.firestore().collection('posts').where('username', '==', userSnapshot.docs[0].data().username).get().then(postsData => {
                    let postPoints = 0;
                    postsData.docs.forEach(doc => {
                        postPoints += doc.data().points;
                    });

                    this.setState({ postPoints: postPoints, posts: postsData.docs });
                });
                fire.firestore().collection('comments').where('creator', '==', userSnapshot.docs[0].data().username).get().then(commentsData => {
                    let commentPoints = 0;
                    commentsData.docs.forEach(doc => {
                        commentPoints += doc.data().points;
                    });

                    this.setState({ commentPoints: commentPoints, comments: commentsData.docs });
                });
            }
        })
    }

    updatePosts = () => {
        fire.firestore().collection('posts').where('username', '==', this.state.user.data().username).get().then(postsData => {
            this.setState({ posts: postsData.docs })
        });
    }

    updateComments = () => {
        fire.firestore().collection('comments').where('creator', '==', this.state.user.data().username).get().then(commentsData => {
            this.setState({ comments: commentsData.docs })
        });
    }

    refresh = () => {
        window.location.reload(false);
    }

    renderFeed = () => {
        console.log('RENDERING')
        let feed = [];
        this.state.posts.forEach(post => {
            feed.push(post)
        })
        this.state.comments.forEach(comment => {
            feed.push(comment)
        })
        const sortedFeed = feed.sort((prev, next) => (prev.data().dateCreated.toDate() < next.data().dateCreated.toDate()) ? 1 : -1);
        return sortedFeed
    }




    render() {
        return (
            this.state.user === null ?
                <div>user not found</div>
                :
                <div>
                    <img width={'20px'} src={this.state.user.data().photoUrl} alt="Profile picture" />
                    <div>{this.state.user.data().username}</div>
                    <div>Post points: {this.state.postPoints}</div>
                    <div>Comment points: {this.state.commentPoints}</div>
                    <div>Account created: {this.state.accountCreated}</div>
                    {this.state.posts && this.state.comments ? this.renderFeed().map(post => (
                        post.data().title ? <div key={post.id}>
                            <PostTemplate redirect={false} updatePosts={this.refresh} post={post} user={fire.auth().currentUser} profile={true} />
                            <Link to={`/group/${post.data().group}/post/${post.id}`}>{post.data().commentCount === 1 ? `${post.data().commentCount} Comment` : `${post.data().commentCount} Comments`}</Link>
                        </div>
                            : <CommentTemplate user={fire.auth().currentUser} key={post.id} updateComments={this.updateComments} comment={post} postId={post.data().postId} profile={true} />)) : <div>loading</div>}
                </div>

        );
    }
}

export default withRouter(UserProfile);


