import React from 'react';
import {
  Link
} from "react-router-dom";


import Logo from './assets/bread-logo.png'
import fire from './config/Fire';
import GroupsNav from './GroupsNav';

export default class Header extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      currentUser: fire.auth().currentUser
    }
  }

  logout = () => {
    fire.auth().signOut().then(this.props.updateView);
  }

  render() {
    return (
      <header>
        <Link to='/'><img id='logo' src={Logo} alt="logo" /></Link>
        <GroupsNav setModal={this.props.setModal} currentUser={fire.auth().currentUser}/>
        {fire.auth().currentUser ?
          <div>
            <Link to='/groups'>All groups</Link>
            <Link to={`/profile/${fire.auth().currentUser.displayName}`}>Profile</Link>
            <Link to='/settings'>Settings</Link>
            <Link to='/' onClick={this.logout}>Logout</Link>
          </div> :
          (<div><button onClick={() => this.props.setModal('login')} id='loginButton'>LOGIN</button> <button onClick={() => this.props.setModal('signup')} id='signupButton'>SIGN UP</button></div>)}
      </header>
    );
  }
}


