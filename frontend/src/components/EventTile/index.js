import './EventTile.css';

import { Link } from "react-router-dom";

function EventTile({event, curUser, openModal, myEvents = false}) {
    const {startDate, type, Group} = event;

    const startString = new Date(startDate).toString();

    return (
        <>
            <hr className="tile-split"/>
            <Link className="tile-link" to={`/events/${event.id}`} onClick={() => window.scrollTo(0, 0)}>
                <div className="tile-ctn">
                    <div className="e-tile-img-ctn">
                        <img className="e-tile-img" src={event?.previewImage}/>
                    </div>
                    <div className="e-tile-info">
                        <div className="e-date-time">
                            <span>{startString?.slice(0, 3)}, {startString?.slice(4, 10)}, {startString?.slice(10, 15)}</span>
                            <i className="fa-solid fa-circle fa-2xs"></i>
                            <span>{startDate?.slice(11, 16)}</span>
                        </div>
                        <div className="e-name-hosted">
                            <div className="e-tile-event-name">{event.name}</div>
                            <div>Hosted by <span className="e-group-name">{Group.name}</span></div>
                        </div>
                        <div>{type}</div>
                    </div>
                </div>
                <div className="e-description">{event?.description}</div>
            </Link>
            {myEvents && <div className="event-manage-btns">
                { +event.Group.organizerId === +curUser.id ?
                    <>
                        <button onClick={() => openModal('updateEvent', {type: 'update', event})}>Update</button>
                        <button onClick={() => openModal('deleteEvent', event)}>Delete</button>
                    </>
                    :
                    <button onClick={() => alert('feature coming soon~')}>Cancel Attendance</button>
                }
            </div>}
        </>
    );
}

export default EventTile;
