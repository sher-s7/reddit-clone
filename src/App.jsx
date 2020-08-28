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
import UserProfile from './UserProfile';
import NewPostModal from './NewPostModal';
import AllGroups from './AllGroups';
import Post from './Post';
import NewGroupModal from './NewGroupModal';
import Settings from './Settings';
import SubscribedFeed from './SubscribedFeed';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      modal: null,
      posts: null,
      postLimit: 20,
      postLimitIncrement: 20,
      disableLoadMore: false,
      scrollPostButton: 'hidden',
      scrollY: 0,
    }
    this.props.hideLoader();
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
    this.fetchPosts();
    document.addEventListener('scroll', this.showNewPostButton)
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
    if (modal) {
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.position = 'fixed';
      console.log('helo')
    }

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
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  showNewPostButton = this.debounce(() => {
    if (window.scrollY > 200) {
      this.setState({ scrollPostButton: '' })
    } else {
      this.setState({ scrollPostButton: 'hidden' })
    }
  }, 250)

  fetchPosts = (newLimit) => {
    console.log('fetching')
    this.props.showLoader();
    fire.firestore().collection('posts').orderBy('dateCreated', 'desc')
      .limit(newLimit || this.state.postLimit).get().then(postsData => {
        console.log(postsData.docs)
        if ((newLimit && postsData.docs.length === this.state.posts.length) || postsData.docs.length === 0) {
          this.setState({ disableLoadMore: true })
        }
        this.setState({
          posts: postsData.docs
        });
        this.props.hideLoader();
        console.log('state', this.state.posts)

      });
    if (newLimit) this.setState({ postLimit: newLimit });
  }

  fetchNextPosts = () => {
    this.fetchPosts(this.state.postLimit + this.state.postLimitIncrement);
  }

  updateView() {
    window.location.reload(false);
  }

  render() {
    return (
      <Router>

        <Header updateView={this.updateView} authListener={this.authListener} user={this.state.currentUser} setModal={this.setModal} />
        {this.state.modal}
        <button id='scrollPostButton' className={this.state.scrollPostButton} onClick={() => this.setModal('text')}><i className="las la-plus"></i></button>
        <Switch>
          <Route exact path='/'>
            <Home showLoader={this.props.showLoader} hideLoader={this.props.hideLoader} updatePosts={this.fetchPosts} disableLoadMore={this.state.disableLoadMore} loadMore={this.fetchNextPosts} posts={this.state.posts ? this.state.posts : null} setModal={this.setModal} />
          </Route>
          <Route exact path='/feed'>
            <SubscribedFeed showLoader={this.props.showLoader} hideLoader={this.props.hideLoader} postLimit={this.state.postLimit} setModal={this.setModal} user={this.state.currentUser} />
          </Route>
          <Route exact path='/profile/:userId' render={({ match }) => <UserProfile showLoader={this.props.showLoader} hideLoader={this.props.hideLoader} updatePosts={this.fetchPosts} userId={match.params.userId} />} />
          <Route exact path='/group/:groupId' render={({ match }) => <Group showLoader={this.props.showLoader} hideLoader={this.props.hideLoader} postLimit={this.state.postLimit} updatePosts={this.fetchPosts} group={match.params.groupId} setModal={this.setModal} currentUser={this.state.currentUser} />} />
          <Route exact path='/groups'>
            <AllGroups showLoader={this.props.showLoader} hideLoader={this.props.hideLoader} />
          </Route>
          <Route exact path='/group/:groupId/post/:postId' render={({ match }) => <Post showLoader={this.props.showLoader} hideLoader={this.props.hideLoader} currentUser={this.state.currentUser} updatePosts={this.fetchPosts} postId={match.params.postId} />} />
          <Route exact path='/settings'>
            <Settings showLoader={this.props.showLoader} hideLoader={this.props.hideLoader} currentUser={this.state.currentUser} />
          </Route>
          <Route render={() => <h1>404: page not found</h1>} />
        </Switch>


      </Router>
    );
  }
}


