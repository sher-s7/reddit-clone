import React from 'react';
import Feed from './Feed';
import NewPost from './NewPost';
import fire from './config/Fire';
import firebase from 'firebase/app';

export default class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        if(this.props.currentUser) {
            fire.firestore().collection('users').doc(this.props.currentUser.uid).get().then(userRef => {
                if(userRef.data().joinedGroups.includes(this.props.group)) {
                    this.setState({
                        joined: true
                    });
                } else {
                    this.setState({
                        joined: false
                    })
                }
            })
        }
        this.fetchPosts();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.group !== this.props.group) {
            this.fetchPosts();
        }
    }

    fetchPosts = () => {
        fire.firestore().collection('posts').where('group', '==', this.props.group).orderBy('dateCreated', 'desc').limit(25).get().then(postsData => {
          this.setState({
            posts: postsData.docs
          });
        });
    }

    joinGroup = () => {
        fire.firestore().collection('users').doc(fire.auth().currentUser.uid).update({
            joinedGroups: firebase.firestore.FieldValue.arrayUnion(this.props.group)
        }).then(this.setState({joined: true}))
        .catch(error => console.error(error));
    }

    leaveGroup = () => {
        fire.firestore().collection('users').doc(fire.auth().currentUser.uid).update({
            joinedGroups: firebase.firestore.FieldValue.arrayRemove(this.props.group)
        }).then(this.setState({joined: false}))
        .catch(error => console.error(error));
    }
    render() {
        return (
            <div>
                {this.state.joined ? <button id='leaveGroup' onClick={this.leaveGroup}>LEAVE</button> : <button id='joinGroup' onClick={this.joinGroup}>JOIN</button>}
                <NewPost setModal={this.props.setModal} />
                {this.state.posts ? <Feed updatePosts={this.props.updatePosts} posts={this.state.posts} /> : <span id='loading'>Loading</span>}
            </div>
        );
    }
}