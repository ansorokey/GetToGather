import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from './ProfileButton.js';

import './Navigation.css';

function Navigation() {
    const curUser = useSelector(state => state.session.user);

    const loggedOut = (
        <>
            <li>
                <NavLink exact to="login">Log In</NavLink>
            </li>

            <li>
                <NavLink exact to="signup">Sign Up</NavLink>
            </li>
        </>
    );

    const loggedIn = (
        <li>
            <ProfileButton user={curUser}/>
        </li>
    );

    return (
        <ul>
            <li>
                <NavLink exact to="/">Home</NavLink>
            </li>
            { curUser ? loggedIn : loggedOut}
        </ul>
    );
};

export default Navigation;
