import { NavLink } from 'react-router-dom';

function Listings() {

    return (
        <div>
            <NavLink exact to="/events">Events</NavLink>
            <NavLink exact to="/groups">Groups</NavLink>
        </div>
    );
}

export default Listings;
