import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import CurrentUserProfile from './CurrentUserProfile';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';

import Logo from './assets/robot-logo.png'
import fire from './config/Fire';

export default class Header extends React.Component {


  logout = () => {
    fire.auth().signOut();
  }

  render() {
    return (
      <header>

        <Router>
          <Link to='/'><img src={Logo} alt="logo" /></Link>
          {this.props.user ?
            <div>
              <Link to={`/profile/${this.props.user.displayName}`}>Profile</Link>
              <Link to='/' onClick={this.logout}>Logout</Link>
              <Switch>
                <Route path='/profile/:userId'>
                  <CurrentUserProfile user={this.props.user} />
                </Route>
              </Switch>
            </div> :
            (<div><Login /> <Signup /></div>)}
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
          </Switch>
        </Router>



      </header>
    );
  }
}


