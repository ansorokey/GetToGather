import { Link } from "react-router-dom";
import './EventTile.css';

function EventTile({event}) {
    const {startDate, numAttending, Group} = event;
    const startString = new Date(startDate).toString();

    return (
        <>
            <hr className="tile-split"/>
            <Link className="tile-link" to={`/events/${event.id}`} onClick={() => window.scrollTo(0, 0)}>
                <div className="tile-ctn">
                    <div className="tile-img-ctn">
                        <img className="tile-img" src={event?.previewImage}/>
                    </div>
                    <div className="e-tile-info">
                        <div className="e-date-time">
                            <span>{startString?.slice(0, 3)}, {startString?.slice(4, 10)}, {startString?.slice(10, 15)}</span>
                            <i class="fa-solid fa-circle fa-2xs"></i>
                            <span>{startDate?.slice(11, 16)}</span>
                            {/* <p>{endDate.slice(0, 10)} {endDate.slice(11, 16)}</p> */}
                        </div>
                        <div className="e-name-hosted">
                            <div className="e-tile-event-name">{event.name}</div>
                            <div>Hosted by <span className="e-group-name">{Group.name}</span></div>
                        </div>
                        <div> {numAttending >= 0 ? numAttending : event?.Attendance?.length} Attending</div>
                    </div>
                </div>
                <div className="e-description">{event?.description}</div>
            </Link>
        </>
    );
}

export default EventTile;
