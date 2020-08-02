import React from 'react';
import Feed from './Feed';
import fire from './config/Fire';

export default class Home extends React.Component {

    fetchPosts() {
        return fire.firestore().collection('posts').orderBy('dateCreated').limit(25).get();
    }

    render() {
        return (
            <div>
                Home
                <Feed fetchPosts={this.fetchPosts} />
            </div>
        );
    }
}