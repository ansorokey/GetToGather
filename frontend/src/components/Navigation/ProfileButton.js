import { logout } from "../../store/session";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { useModalContext } from "../../Context/ModalContext";

function ProfileButton({ user }) {
    const {setModalType, openModal} = useModalContext();
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

    const loggedInMenu = (
        <>
            <ul ref={ulRef}>
                <li>{user?.username}</li>
                <li>{user?.firstName}</li>
                <li>{user?.lastName}</li>
                <li>{user?.email}</li>
            </ul>
            <button onClick={handleLogout}>
                Log Out
            </button>
        </>
    );

    const loggedOutMenu = (
        <ul ref={ulRef}>
            <li>
                <button onClick={() => openModal('login')}>Log In</button>
            </li>

            <li>
                <button onClick={() => openModal('signup')}>Sign Up</button>
            </li>
        </ul>
    );

    let menu = user ? loggedInMenu : loggedOutMenu;

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
