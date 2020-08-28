import React from 'react';
import Feed from './Feed';
import NewPost from './NewPost';

export default class Home extends React.Component {
    
    componentDidMount() {
        console.log('mounted home')
        this.props.updatePosts();
        document.addEventListener('scroll', this.props.showNewPostButton);
    }

    componentDidUpdate(prevProps) {
        console.log('home update check')
        if(prevProps.posts !== this.props.posts){
            console.log('home posts', this.props.posts)
        }
    }

    componentWillUnmount() {
        this.props.hideNewPostButton();
        document.removeEventListener('scroll', this.props.showNewPostButton);
    }

    render() {
        return (
            <div className='feedContainer'>
                <h1 className='feedHeading'>ALL</h1>
                <NewPost setModal={this.props.setModal} />
                {this.props.posts ? <Feed disableLoadMore={this.props.disableLoadMore} loadMore={this.props.loadMore} updatePosts={this.props.updatePosts} posts={this.props.posts} /> : null}
            </div>
        );
    }
}