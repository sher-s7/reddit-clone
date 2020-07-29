import React from 'react';

import Profile from './Profile';
import Login from './Login';
import Signup from './Signup';

import Logo from './assets/robot-logo.png'

export default class Header extends React.Component {

 
  render() {
  return (
    <header>
        <img src={Logo} alt="logo"/>

        {this.props.user ? (<Profile user={this.props.user}/>) : 
        (<div><Login/> <Signup/></div>)}
    </header>
  );
}
}


