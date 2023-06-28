import { Link } from "react-router-dom";
import './EventTile.css';

function EventTile({event}) {

    return (
        <Link className="tile-link" to={`/events/${event.id}`}>
            <div className="tile-ctn">
                <div className="tile-img-ctn">
                    <img className="tile-img"/>
                </div>
                <div className="tile-info">
                    <div className="date-time">
                        <p>Date</p>
                        <p>Time</p>
                    </div>
                    <h2>{event.name}</h2>
                    <h3>{event.Venue}</h3>
                </div>
            </div>
        </Link>
    );
}

export default EventTile;
