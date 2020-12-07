import React from 'react';
import Feed from './Feed';
import NewPost from '../Components/Posts/NewPost';
import fire from '../config/Fire';
import { withRouter } from 'react-router-dom';
import GroupInfo from '../Components/Groups/GroupInfo';

class Group extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            joined: false,
            postLimit: this.props.postLimit,
            disableLoadMore: false,
        }
    }

    componentDidMount() {
        this._isMounted = true;
        this.props.showLoader();
        
        this.fetchPosts();
        document.addEventListener('scroll', this.props.showNewPostButton);
    }

    

    componentDidUpdate(prevProps) {
        if (this._isMounted && (prevProps.group !== this.props.group)) {
            this.fetchPosts();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.hideNewPostButton();
        document.removeEventListener('scroll', this.props.showNewPostButton);
    }

    fetchPosts = (limit) => {
        fire.firestore().collection('posts').where('group', '==', this.props.group).orderBy('dateCreated', 'desc').limit(limit || this.state.postLimit).get().then(postsData => {
            if ((limit && postsData.docs.length === this.state.posts.length) || postsData.docs.length === 0) {
                this.setState({ disableLoadMore: true })
            }
            this.setState({
                posts: postsData.docs
            });
        }).then(this.props.hideLoader);
        if (limit) this.setState({ postLimit: limit });
    };



    fetchNextPosts = () => {
        this.fetchPosts(this.state.postLimit + this.props.postLimit);
    }

    

    

    render() {
        return (
            <div className='feedContainer'>
                <GroupInfo group={this.props.group} currentUser={this.props.currentUser}/>
                <NewPost setModal={this.props.setModal} />
                {this.state.posts ? <Feed disableLoadMore={this.state.disableLoadMore} loadMore={this.fetchNextPosts} updatePosts={this.fetchPosts} posts={this.state.posts} /> : null}
            </div>
        );
    }
}

export default withRouter(Group);