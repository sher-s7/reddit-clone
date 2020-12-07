import React from 'react';
import Feed from './Feed';
import NewPost from '../Components/Posts/NewPost';
import fire from '../config/Fire';
import { withRouter } from 'react-router-dom';

class SubscribedFeed extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            postLimit: this.props.postLimit,
            disableLoadMore: false,
            hideMessage: 'hidden',
        }
    }

    componentDidMount() {
        if (this.props.user) {
            this.fetchPosts();
        }
        this.props.showLoader();
        this.authListener();
        document.addEventListener('scroll', this.props.showNewPostButton);
    }

    authListener() {
        fire.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.props.history.push('/')
            }
        });
    }

    componentDidUpdate(prevProps) {

        if (prevProps.user !== this.props.user) {
            this.fetchPosts()
        }
    }

    componentWillUnmount() {
        this.props.hideNewPostButton();
        document.removeEventListener('scroll', this.props.showNewPostButton);
    }

    fetchPosts = (limit) => {
        fire.firestore().collection('users').doc(this.props.user.uid).get().then(user => {
            if (user.data().joinedGroups.length > 0) {
                fire.firestore().collection('posts').where('group', 'in', user.data().joinedGroups).orderBy('dateCreated', 'desc').limit(limit || this.state.postLimit).get().then(posts => {
                    if ((limit && posts.docs.length === this.state.posts.length) || posts.docs.length === 0) {
                        this.setState({ disableLoadMore: true })
                    }
                    this.setState({ posts: posts.docs });
                }).catch(error => {
                    console.error(error)
                    this.props.hideLoader();
                    this.setState({ hideMessage: '' });
                });
            } else {
                this.props.hideLoader();
                this.setState({ hideMessage: '' });
            }
        }).then(this.props.hideLoader).catch(error => {
            console.error(error)
            this.props.hideLoader();
            this.setState({ hideMessage: '' });
        });
        if (limit) this.setState({ postLimit: limit });
    }

    fetchNextPosts = () => {
        this.fetchPosts(this.state.postLimit + this.props.postLimit);
    }

    render() {
        return (
            <div className='feedContainer'>
                <h1 className='feedHeading'>MY FEED</h1>
                <NewPost setModal={this.props.setModal} />
                {this.state.posts ? <Feed disableLoadMore={this.state.disableLoadMore} loadMore={this.fetchNextPosts} updatePosts={this.fetchPosts} posts={this.state.posts} /> : <span className={this.state.hideMessage} id='joinGroupsMessage'>Posts from your groups will show up here once you've joined them.</span>}
            </div>
        );
    }
}

export default withRouter(SubscribedFeed);