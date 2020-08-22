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
      currentUser: fire.auth().currentUser,
      hideAccount: true,
    }
  }

  logout = () => {
    fire.auth().signOut().then(this.props.updateView);
  }

  toggleAccountSettings = () => {
    this.setState(prevState => {
      return {
        hideAccount: !prevState.hideAccount
      }
    })
  }

  render() {
    return (
      <header>
        <Link to='/'><img id='logo' src={Logo} alt="logo" /></Link>
        <GroupsNav setModal={this.props.setModal} currentUser={fire.auth().currentUser} />
        {fire.auth().currentUser ? <Link to='/groups'>All groups</Link> : null}
        {fire.auth().currentUser ?
          <div className='navButtons'>
            <button className='accountButton' onClick={this.toggleAccountSettings}><i class="las la-user-cog"></i></button>
            <Link className='all' to='/' onClick={() => this.setState({hideAccount: true})}>ALL</Link>
            <Link className='feed' to='/feed' onClick={() => this.setState({hideAccount: true})}>MY FEED</Link>
            <div className={`account${this.state.hideAccount ? ' hide' : ''}`}>
              <Link className='profile' to={`/profile/${fire.auth().currentUser.displayName}`} onClick={() => this.setState({hideAccount: true})}>PROFILE</Link>
              <Link className='settings' to='/settings' onClick={() => this.setState({hideAccount: true})}>SETTINGS</Link>
              <Link className='logout' to='/' onClick={this.logout}>LOGOUT</Link>
            </div>
          </div> :
          (<div><button onClick={() => this.props.setModal('login')} id='loginButton'>LOGIN</button> <button onClick={() => this.props.setModal('signup')} id='signupButton'>SIGN UP</button></div>)}
      </header>
    );
  }
}


