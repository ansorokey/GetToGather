import { logout } from "../../store/session";
import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useModalContext } from "../../Context/ModalContext";

function ProfileButton({ user }) {
    const history = useHistory();
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
        history.push('/');
    }

    const menu = (
        <div className='menu' ref={ulRef}>
                <div className="hello-user">Hello, {user?.firstName}</div>
                <div>{user?.email}</div>
                <Link className='user-menu-btn' to="/groups/current">Your Groups</Link>
                <Link className='user-menu-btn' to="/events/current">Your Events</Link>
            <button className="logout-btn" onClick={handleLogout}>
                Log Out
            </button>
        </div>
    );

    return (
        <div className='profile-ctn' onClick={openMenu}>
            <i className="fa-regular fa-user fa"></i>
            { showMenu ? <i className="fa-solid fa-chevron-up fa"></i> : <i className="fa-solid fa-chevron-down fa"></i>}
            { showMenu && menu }
        </div>
    );
}

export default ProfileButton;
