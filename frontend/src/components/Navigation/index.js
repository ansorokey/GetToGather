import './styles.css';

import React from 'react';
import LogInSignUp from './LogInSignUp.js';
import ProfileButton from './ProfileButton.js';

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useModalContext } from '../../Context/ModalContext.js';

function Navigation({ firstLoad }){
  const { openModal } = useModalContext();

  const sessionUser = useSelector(state => state.session.user);

    return (
      <nav className="nav-bar">
          <NavLink exact to="/">
            <img className='logo' src='https://res.cloudinary.com/dzntryr5a/image/upload/v1689116250/TEAM_UP_i2q07g.png'/>
          </NavLink>

          <div className='session'>
            { sessionUser && <span className='create-group-prof' onClick={() => openModal('createGroup')}>Start a new Group</span>}
            { sessionUser ? <ProfileButton user={sessionUser} /> : <LogInSignUp/>}
          </div>
      </nav>
    );
  }

export default Navigation;
