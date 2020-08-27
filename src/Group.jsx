import React from 'react';
import Feed from './Feed';
import NewPost from './NewPost';
import fire from './config/Fire';
import firebase from 'firebase/app';
import { withRouter } from 'react-router-dom';
import Toast from './assets/toast.svg';

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
        fire.firestore().collection('groups').doc(this.props.group).get().then(groupRef => {
            if (this._isMounted && groupRef.data()) {
                this.setState({ numberOfUsers: groupRef.data().numberOfUsers, description: groupRef.data().description });
            } else {
                this.props.history.push('/');
            }
        });
        this.updateJoinButton(this.props.currentUser);
        this.fetchPosts();
    }

    updateJoinButton = (user) => {
        this.setState({ currentUser: user })
        if (this._isMounted && user) {
            fire.firestore().collection('users').doc(user.uid).get().then(userRef => {

                if (userRef.exists && userRef.data().joinedGroups.includes(this.props.group)) {
                    this.setState({
                        joined: true
                    });
                } else {
                    this.setState({
                        joined: false
                    });
                }
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentUser !== this.props.currentUser) {
            this.updateJoinButton(this.props.currentUser);
        }
        if (this._isMounted && (prevProps.group !== this.props.group)) {
            fire.firestore().collection('groups').doc(this.props.group).get().then(groupRef => {
                this.setState({ numberOfUsers: groupRef.data().numberOfUsers, description: groupRef.data().description });
            });
            this.fetchPosts();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    fetchPosts = (limit) => {
        fire.firestore().collection('posts').where('group', '==', this.props.group).orderBy('dateCreated', 'desc').limit(limit || this.state.postLimit).get().then(postsData => {
            if ((limit && postsData.docs.length === this.state.posts.length) || postsData.docs.length === 0) {
                this.setState({ disableLoadMore: true })
            }
            this.setState({
                posts: postsData.docs
            });
        });
        if (limit) this.setState({ postLimit: limit });
    };



    fetchNextPosts = () => {
        this.fetchPosts(this.state.postLimit + this.props.postLimit);
    }

    joinGroup = () => {
        if (this.state.currentUser) {
            fire.firestore().collection('users').doc(this.state.currentUser.uid).update({
                joinedGroups: firebase.firestore.FieldValue.arrayUnion(this.props.group)
            }).then(() => {
                this.setState({ joined: true })
                fire.firestore().collection('groups').doc(this.props.group).update({
                    numberOfUsers: firebase.firestore.FieldValue.increment(1)
                })
            })
                .catch(error => console.error(error));
        } else {
            alert('Must be logged in to join groups.');
        }
    }

    leaveGroup = () => {
        if (this.state.currentUser) {
            fire.firestore().collection('users').doc(this.state.currentUser.uid).update({
                joinedGroups: firebase.firestore.FieldValue.arrayRemove(this.props.group)
            }).then(() => {
                this.setState({ joined: false })
                fire.firestore().collection('groups').doc(this.props.group).update({
                    numberOfUsers: firebase.firestore.FieldValue.increment(-1)
                })
            })
                .catch(error => console.error(error));
        } else {
            alert('Must be logged in to perform this action.')
        }
    }

    pluralize = (word, num) => {
        return num !== 1 ? `${word}S` : word;
    }

    render() {
        return (
            <div className='feedContainer'>
                <div className='groupHeaderContainer'>
                    <h1 className='groupHeader'>{this.props.group}</h1>
                    {this.state.joined ? <button id='leaveGroup' onClick={this.leaveGroup}>LEAVE</button> : <button id='joinGroup' onClick={this.joinGroup}>JOIN</button>}
                    {typeof this.state.numberOfUsers === 'number' ?
                        <span className='numMembers'><span className='number'>{this.state.numberOfUsers}</span> {this.pluralize('MEMBER', this.state.numberOfUsers)}</span>
                        : null}
                    {this.state.description ? <h4 className='groupDescription'>{this.state.description}</h4> : null}
                </div>
                <NewPost setModal={this.props.setModal} />
                {this.state.posts ? <Feed disableLoadMore={this.state.disableLoadMore} loadMore={this.fetchNextPosts} updatePosts={this.fetchPosts} posts={this.state.posts} /> : <img src={Toast} alt='loading' className='loading'/>}
            </div>
        );
    }
}

export default withRouter(Group);