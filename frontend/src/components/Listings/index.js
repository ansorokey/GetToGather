import { NavLink } from 'react-router-dom';
import './Listings.css';

function Listings() {

    return (
        <div className="events-groups">
            <NavLink className="eg-link" to="/events"><h2>Events</h2></NavLink>
            <NavLink className="eg-link" to="/groups"><h2>Groups</h2></NavLink>
        </div>
    );
}

export default Listings;
