import React from 'react';
import fire from './config/Fire';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Header from './Header';
import Profile from './Profile';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user:null,
    }
    this.authListener = this.authListener.bind(this);
  }

  componentDidMount() {
    this.authListener();
    
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
          fire.storage().ref('defaultProfilePicture.png').getDownloadURL().then(url => {
            user.updateProfile({
              photoURL: url
            })
          })
      } else {
        this.setState({user: null});
      }
    });
  }
  
  render() {
  return (
    <div className="App">
      <Header authListener={this.authListener} user={this.state.user}/>
    </div>
  );
}
}


