import React from 'react';
import {
  Link
} from "react-router-dom";


import Logo from './assets/robot-logo.png'
import fire from './config/Fire';
import GroupsNav from './GroupsNav';
import AllGroups from './AllGroups';

export default class Header extends React.Component {


  logout = () => {
    fire.auth().signOut();
  }

  render() {
    return (
      <header>
        <Link to='/'><img src={Logo} alt="logo" /></Link>
        <Link to='/groups'>All groups</Link>
        <GroupsNav/>
        {this.props.user ?
          <div>
            <Link to={`/profile/${this.props.user.displayName}`}>Profile</Link>
            <Link to='/' onClick={this.logout}>Logout</Link>
          </div> :
          (<div><button onClick={() => this.props.setModal('login')} id='loginButton'>LOGIN</button> <button onClick={() => this.props.setModal('signup')} id='signupButton'>SIGN UP</button></div>)}
      </header>
    );
  }
}


