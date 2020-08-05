import React from 'react';
import Feed from './Feed';
import NewPost from './NewPost';
import fire from './config/Fire';

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        this.fetchPosts();
    }

    componentDidUpdate(prevProps) {
        console.log('Group: componentDidUpdate loop test')
        if (prevProps.group !== this.props.group) {
            this.fetchPosts();
        }
    }

    fetchPosts = () => {
        console.log('helo')
        fire.firestore().collection('posts').where('group', '==', this.props.group).orderBy('dateCreated', 'desc').limit(25).get().then(postsData => {
          this.setState({
            posts: postsData.docs
          });
        });
    }
    render() {
        return (
            <div>
                <NewPost setModal={this.props.setModal} />
                {this.state.posts ? <Feed posts={this.state.posts} /> : <span id='loading'>Loading</span>}
            </div>
        );
    }
}