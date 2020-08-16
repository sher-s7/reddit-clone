import React from 'react';
import fire from './config/Fire';
import PostTemplate from './PostTemplate';
import { Link } from 'react-router-dom';
import RobotLogo from './assets/robot-logo.png'
export default class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: fire.auth().currentUser,
            posts: this.props.posts
        }
    }

    componentDidUpdate(prevProps) {
        console.log('update check')
        if(prevProps.posts !== this.props.posts) {
            this.setState({posts: this.props.posts})
        }
    }

    render() {
        return (
            <div id='feed'>
                <ul>
                    {this.state.posts.map(post => (
                        <li key={post.id} className='feedPost'>
                            <PostTemplate redirect={false} updatePosts={this.props.updatePosts} key={post.id} post={post} user={this.state.user} />
                            <Link to={`/${post.data().group}/post/${post.id}`}>{post.data().commentCount === 1 ? `${post.data().commentCount} Comment` : `${post.data().commentCount} Comments`}</Link>
                        </li>
                    ))}
                </ul>
                    {this.props.disableLoadMore ? <div id='endOfPage'><img alt='end of page' src={RobotLogo}/></div> : <button onClick={this.props.loadMore}>Load more</button> }
            </div>
        );
    }
}