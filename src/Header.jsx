import React from 'react';
import {
  Link, withRouter
} from "react-router-dom";


import Toast from './Toast';
import fire from './config/Fire';
import GroupsNav from './GroupsNav';

class Header extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: fire.auth().currentUser,
      hideAccount: true,
    }

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    this.updateHeaderClass();
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('touchstart', this.handleClickOutside);
  }

  componentDidUpdate(prevProps) {
    console.log('header update')
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.updateHeaderClass();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('touchstart', this.handleClickOutside);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
      this.setState({ hideAccount: true });
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
    } else {
      this.setState({ currentPage: null })
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
        <Link to='/'>
          <Toast />
        </Link>
        <Link to='/'><h1 id='breddit'>Breddit</h1></Link>
        <GroupsNav setModal={this.props.setModal} currentUser={fire.auth().currentUser} />
        {fire.auth().currentUser ?
          <div className='navButtons'>
            <button className='accountButton' onClick={this.toggleAccountSettings}><i className="las la-user-cog"></i></button>
            <Link className='all' to='/' onClick={() => this.setState({ hideAccount: true })}><i className="las la-globe"></i></Link>
            <Link className='feed' to='/feed' onClick={() => this.setState({ hideAccount: true })}><i className="las la-home"></i></Link>
            <div ref={this.wrapperRef} className={`account${this.state.hideAccount ? ' hide' : ''}`}>
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