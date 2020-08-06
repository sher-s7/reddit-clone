import React from 'react';
import fire from './config/Fire';
import PostTemplate from './PostTemplate';
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
                        <PostTemplate updatePosts={this.props.updatePosts} key={post.id} post={post} user={this.state.user}/>
                    ))}
                </ul>
            </div>
        );
    }
}