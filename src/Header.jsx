import React from 'react';

import Logo from './assets/logo.png';   
import Profile from './Profile';
import Login from './Login';
import Signup from './Signup';

export default class Header extends React.Component {

 
  render() {
  return (
    <header>
        <img src={Logo} alt="logo"/>

        {this.props.user ? (<Profile authListener={this.props.authListener} user={this.props.user}/>) : (<div><Login/> <Signup/></div>)}
    </header>
  );
}
}


