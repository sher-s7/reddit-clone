import React from 'react';
import fire from './config/Fire';

import Header from './Header'

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
        console.log('User:', user.displayName);
        this.setState({ user });
        // localStorage.setItem('user', user.uid);
      } else {
        this.setState({user: null});
        // localStorage.removeItem('user');
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


