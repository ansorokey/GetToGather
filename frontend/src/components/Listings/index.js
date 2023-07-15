import './Listings.css';

import { NavLink } from 'react-router-dom';

function Listings() {

    return (
        <div className="events-groups">
            <NavLink className="eg-link" to="/events"><div className="eg-text">Events</div></NavLink>
            <NavLink className="eg-link" to="/groups"><div className="eg-text">Groups</div></NavLink>
        </div>
    );
}

export default Listings;
