/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import fire from './config/Fire';
import { format } from 'date-fns';

import { withRouter } from 'react-router-dom';
import PostTemplate from './PostTemplate';
import CommentTemplate from './CommentTemplate';

class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            showMessage: false,
        }
    }

    componentDidMount() {
        this.updateView();
    }

    componentDidUpdate(prevProps) {
        console.log('update check')
        if (prevProps.location.pathname !== this.props.location.pathname) {
            window.location.reload(true);
        }
    }



    updateView = () => {
        this.props.showLoader();
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
            } else {
                this.setState({ showMessage: true })
            }
        }).then(this.props.hideLoader).catch(error => console.error(error));
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
                <div id='userNotFound' className={this.state.showMessage ? '' : 'hidden'}>User not found</div>
                :
                <div id='userProfile'>
                    <div id='profileInfo'>
                        <div id='profilePictureContainer'>
                            <img id='profilePicture' src={this.state.user.data().photoUrl} alt="Profile picture" />
                        </div>
                        <div id='username'>{this.state.user.data().username}</div>
                        <div id='postPoints'>Post points: <span>{this.state.postPoints}</span></div>
                        <div id='commentPoints'>Comment points: <span>{this.state.commentPoints}</span></div>
                        <div id='accountCreated'>Account created: <span>{this.state.accountCreated}</span></div>
                    </div>
                    <ul>
                        {this.state.posts && this.state.comments ? this.renderFeed().map(post => (
                            post.data().title ? <li className='feedPost' key={post.id}>
                                <PostTemplate redirect={false} updatePosts={this.refresh} post={post} user={fire.auth().currentUser} profile={true} />
                            </li>
                                : <CommentTemplate user={fire.auth().currentUser} key={post.id} updateComments={this.updateComments} comment={post} postId={post.data().postId} profile={true} />)) : null}
                    </ul>
                </div>

        );
    }
}

export default withRouter(UserProfile);


