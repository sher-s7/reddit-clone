import React from 'react';
import fire from './config/Fire';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Header from './Header';
import Home from './Home';
import Group from './Group';
import Login from './Login';
import Signup from './Signup';
import CurrentUserProfile from './CurrentUserProfile';
import NewPostModal from './NewPostModal';
import AllGroups from './AllGroups';
import Post from './Post';
import NewGroupModal from './NewGroupModal';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      modal: null,
      posts: null,
      postLimit: 2,
      disableLoadMore: false
    }
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
    this.fetchPosts();
  }


  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ currentUser: user });
      } else {
        this.setState({ currentUser: null });
      }
    });
  }

  setModal = (modal) => {
    if (modal === 'login') {
      this.setState({ modal: <Login updateView={this.updateView} setModal={this.setModal} /> })
    } else if (modal === 'signup') {
      this.setState({ modal: <Signup authListener={this.authListener} setModal={this.setModal} /> })
    } else if (modal === 'text' || modal === 'image' || modal === 'link') {
      if (this.state.currentUser) {
        this.setState({ modal: <NewPostModal updateView={this.updateView} setModal={this.setModal} tab={modal} /> })
      } else {
        alert('Must be signed in')
      }
    } else if (modal === 'group') {
      this.setState({ modal: <NewGroupModal setModal={this.setModal} /> })
    } else {
      this.setState({ modal: null })
    }
  }

  fetchPosts = (newLimit) => {
    console.log('fetching')
    fire.firestore().collection('posts').orderBy('dateCreated', 'desc')
      .limit(newLimit || this.state.postLimit).get().then(postsData => {
        if ((newLimit && postsData.docs.length === this.state.posts.length) || postsData.docs.length === 0) {
          this.setState({ disableLoadMore: true })
        } else {
          this.setState({
            posts: postsData.docs
          });
        }
      });
    if (newLimit) this.setState({ postLimit: newLimit });
  }

  fetchNextPosts = () => {
    this.fetchPosts(this.state.postLimit + 2);
  }

  updateView() {
    window.location.reload(false);
  }

  render() {
    return (
      <Router>

        <Header updateView={this.updateView} authListener={this.authListener} user={this.state.currentUser} setModal={this.setModal} />
        {this.state.modal}
        <Switch>
          <Route exact path='/'>
            <Home updatePosts={this.fetchPosts} disableLoadMore={this.state.disableLoadMore} loadMore={this.fetchNextPosts} posts={this.state.posts ? this.state.posts : null} setModal={this.setModal} />
          </Route>
          <Route path='/profile/:userId' render={({ match }) => <CurrentUserProfile userId={match.params.userId} />} />
          <Route path='/group/:groupId' render={({ match }) => <Group disableLoadMore={this.state.disableLoadMore} loadMore={this.fetchNextPosts} updatePosts={this.fetchPosts} group={match.params.groupId} setModal={this.setModal} currentUser={this.state.currentUser} />} />
          <Route path='/groups' component={AllGroups} />
          <Route path='/:groupId/post/:postId' render={({ match }) => <Post currentUser={this.state.currentUser} updatePosts={this.fetchPosts} postId={match.params.postId} />} />
        </Switch>


      </Router>
    );
  }
}


