import { Link } from "react-router-dom";
import './EventTile.css';

function EventTile({event}) {
    const {startDate, endDate, numAttending, Group} = event;

    return (
        <>
            <hr className="tile-split"/>
            <Link className="tile-link" to={`/events/${event.id}`}>
                <div className="tile-ctn">
                    <div className="tile-img-ctn">
                        <img className="tile-img" src={event?.previewImage}/>
                    </div>
                    <div className="tile-info">
                        <div className="date-time">
                            <span>{startDate?.slice(0, 10)}</span>
                            <i className="fa-solid fa-minus"></i>
                            <span>{startDate?.slice(11, 16)}</span>
                            {/* <p>{endDate.slice(0, 10)} {endDate.slice(11, 16)}</p> */}
                        </div>
                        <div>
                            <h2>{event.name}</h2>
                            <div>Hosted by {Group.name}</div>
                        </div>
                        <h3>{event.Venue}</h3>
                        <div> {numAttending >= 0 ? numAttending : event?.Attendance?.length} Attending</div>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default EventTile;
