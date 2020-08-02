import React from 'react';
import fire from './config/Fire';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Header from './Header';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import CurrentUserProfile from './CurrentUserProfile';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      modal: null,
    }
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
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
      this.setState({ modal: <Login setModal={this.setModal} /> })
    } else if (modal === 'signup') {
      this.setState({ modal: <Signup setModal={this.setModal} /> })
    } else {
      this.setState({ modal: null })
    }
  }

  render() {
    return (
      <Router>
        
          <Header authListener={this.authListener} user={this.state.currentUser} setModal={this.setModal} />
          {this.state.modal}

          <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/profile/:userId' render={({ match }) => <CurrentUserProfile userId={match.params.userId} />} />
          </Switch>

       
      </Router>
    );
  }
}


