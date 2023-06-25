import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/session";
import ProfileButton from './ProfileButton.js';

function Navigation() {
    const curUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    function handleLogout(e) {
        e.preventDefault();
        dispatch(logout());
    }

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
        <>
            <li>
                <ProfileButton/>
            </li>
            <li>
                <button onClick={handleLogout}>Log Out</button>
            </li>
        </>
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
