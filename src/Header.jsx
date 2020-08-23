import React from 'react';
import {
  Link, withRouter
} from "react-router-dom";


import Logo from './assets/bread-logo.png'
import fire from './config/Fire';
import GroupsNav from './GroupsNav';

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: fire.auth().currentUser,
      hideAccount: true,
    }
  }

  componentDidMount() {
    const location = window.location.pathname;
    if (location === '/') {
      this.setState({ currentPage: 'curAll' })
    } else if (location.includes('feed')) {
      this.setState({ currentPage: 'curFeed' })
    } else if (location.includes('profile') || location.includes('settings')) {
      this.setState({ currentPage: 'curAccount' })
    }
  }

  componentDidUpdate(prevProps) {
    console.log('header update')
    if(prevProps.location.pathname !== this.props.location.pathname) {
      this.updateHeaderClass();
    }
  }

  updateHeaderClass = () => {
    const location = this.props.location.pathname;
    if (location === '/') {
      this.setState({ currentPage: 'curAll' })
    } else if (location.includes('feed')) {
      this.setState({ currentPage: 'curFeed' })
    } else if (location.includes('profile') || location.includes('settings')) {
      this.setState({ currentPage: 'curAccount' })
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
      <header className={this.state.currentPage}>
        <Link to='/'><img id='logo' src={Logo} alt="logo" /></Link>
        <h1 id='breddit'>Breddit</h1>
        <GroupsNav setModal={this.props.setModal} currentUser={fire.auth().currentUser} />
        {fire.auth().currentUser ? <Link to='/groups'>All groups</Link> : null}
        {fire.auth().currentUser ?
          <div className='navButtons'>
            <button className='accountButton' onClick={this.toggleAccountSettings}><i className="las la-user-cog"></i></button>
            <Link className='all' to='/' onClick={() => this.setState({ hideAccount: true })}>ALL</Link>
            <Link className='feed' to='/feed' onClick={() => this.setState({ hideAccount: true })}>MY FEED</Link>
            <div className={`account${this.state.hideAccount ? ' hide' : ''}`}>
              <Link className='profile' to={`/profile/${fire.auth().currentUser.displayName}`} onClick={() => this.setState({ hideAccount: true })}>PROFILE</Link>
              <Link className='settings' to='/settings' onClick={() => this.setState({ hideAccount: true })}>SETTINGS</Link>
              <Link className='logout' to='/' onClick={this.logout}>LOGOUT</Link>
            </div>
          </div> :
          (<div><button onClick={() => this.props.setModal('login')} id='loginButton'>LOGIN</button> <button onClick={() => this.props.setModal('signup')} id='signupButton'>SIGN UP</button></div>)}
      </header>
    );
  }
}


export default withRouter(Header);