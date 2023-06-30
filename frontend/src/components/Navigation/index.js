import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton.js';
import LogInSignUp from './LogInSignUp.js';
import logo from '../../images/get-to-gather-logo.png';
import './styles.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min.js';
import { useModalContext } from '../../Context/ModalContext.js';

function Navigation({ firstLoad }){
    const { openModal } = useModalContext();
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();

    useEffect(() => {
      if(sessionUser) history.push('/');
    }, [sessionUser])

    return (
      <nav className="nav-bar">
          <NavLink exact to="/">
            <img className='logo' src={logo}/>
          </NavLink>

          <div className='session'>
            {sessionUser && <span className='create-group-prof' onClick={() => openModal('createGroup')}>Create a new Group</span>}
            { sessionUser ? <ProfileButton user={sessionUser} /> : <LogInSignUp/>}
          </div>
      </nav>
    );
  }

export default Navigation;
