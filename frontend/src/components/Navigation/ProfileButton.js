import { logout } from "../../store/session";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";

function ProfileButton({ user: { username, firstName, lastName, email } }) {

    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
    const ulRef = useRef();

    useEffect(() => {
        //Dont need this function when menu is closed
        if(!showMenu) return;

        //add event listener to close menu
        const closeMenu = (e) => {

            if (!ulRef.current.contains(e.target)) setShowMenu(false);
        };
        document.addEventListener('click', closeMenu );

        //remove event listener on dismount
        return () => document.removeEventListener('click', closeMenu);

    }, [showMenu]);

    function openMenu() {
        if (showMenu) return;
        setShowMenu(true);
    };

    function handleLogout(e) {
        e.preventDefault();
        dispatch(logout());
    }

    const menu = (
        <>
            <ul ref={ulRef}>
                <li>{username}</li>
                <li>{firstName}</li>
                <li>{lastName}</li>
                <li>{email}</li>
            </ul>
            <button onClick={handleLogout}>
                Log Out
            </button>
        </>
    );

    return (
        <>
            <button onClick={openMenu}>
                <i className="fa-regular fa-user"></i>
            </button>
            { showMenu ? menu : null }
        </>
    );
}

export default ProfileButton;
