import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton.js';
import LogInSignUp from './LogInSignUp.js';
import logo from '../../images/get-to-gather-logo.png';
import './styles.css';

function Navigation({ firstLoad }){
    const sessionUser = useSelector(state => state.session.user);

    // const loggedIn =

    return (
      <nav className="nav-bar">
          <NavLink exact to="/">
            <img className='logo' src={logo}/>
          </NavLink>

          <div className='session'>
            {/* {firstLoad &&
                <ProfileButton user={sessionUser} />
            } */}
            { sessionUser ? <ProfileButton user={sessionUser} /> : <LogInSignUp/>}
          </div>
      </nav>
    );
  }

export default Navigation;
