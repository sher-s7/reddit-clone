import React from 'react';
import Feed from './Feed';
import NewPost from './NewPost';

export default class Home extends React.Component {
    componentDidMount() {
        this.props.updatePosts();
    }
    render() {
        return (
            <div>
                <NewPost setModal={this.props.setModal} />
                {this.props.posts ? <Feed updatePosts={this.props.updatePosts} posts={this.props.posts} /> : <span id='loading'>Loading</span>}
            </div>
        );
    }
}