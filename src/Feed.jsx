import React from 'react';
import fire from './config/Fire';
import PostTemplate from './PostTemplate';
import { Link } from 'react-router-dom';
export default class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: fire.auth().currentUser
        }
    }

    render() {
        return (
            <div id='feed'>
                <ul>
                    {this.props.posts.map(post => (
                        <li key={post.id} className='feedPost'>
                            <PostTemplate updatePosts={this.props.updatePosts} key={post.id} post={post} user={this.state.user} />
                            <Link to={`/${post.data().group}/post/${post.id}`}>{post.data().commentCount === 1 ? `${post.data().commentCount} Comment` : `${post.data().commentCount} Comments`}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}