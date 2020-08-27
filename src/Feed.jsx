import React from 'react';
import fire from './config/Fire';
import PostTemplate from './PostTemplate';
import { Link } from 'react-router-dom';
import Logo from './assets/bread-logo.png'
export default class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: fire.auth().currentUser,
        }
    }

    componentDidUpdate(prevProps) {
        console.log('feed update check')
        if(prevProps.posts !== this.props.posts) {
            console.log('feed posts', this.props.posts)
        }
    }


    render() {
        return (
            <div id='feed'>
                <ul>
                    {this.props.posts ? this.props.posts.map(post => (
                        <li key={post.id} className='feedPost'>
                            <PostTemplate redirect={false} updatePosts={this.props.updatePosts} key={post.id} post={post} user={this.state.user} />
                        </li>
                    )) : null}
                </ul>
                    {this.props.disableLoadMore ? <div id='endOfPage'><img alt='End of page' src={Logo}/></div> : <button className='loadMore' onClick={this.props.loadMore}>Load more</button> }
            </div>
        );
    }
}