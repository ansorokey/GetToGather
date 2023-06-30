import { NavLink } from 'react-router-dom';
import './Listings.css';

function Listings() {

    return (
        <div className="events-groups">
            <NavLink className="eg-link" to="/events"><div>Events</div></NavLink>
            <NavLink className="eg-link" to="/groups"><div>Groups</div></NavLink>
        </div>
    );
}

export default Listings;
