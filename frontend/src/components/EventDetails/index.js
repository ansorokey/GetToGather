import { useDispatch, useSelector } from 'react-redux';
import './EventDetails.css';
import { useParams, Link } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from 'react';
import { getEventDetailsThunk } from '../../store/events';
import { getGroupDetails } from '../../store/groups';

function EventDetails() {
    const back = '< Back To Events';
    const {eventId} = useParams();
    const dispatch = useDispatch();
    const eventState = useSelector(state => state.events);
    const event = eventState.allEvents[eventId];
    const groupState = useSelector(state => state.groups);
    let group;
    if(event) group = groupState[event.groupId];
    const [loadedEvent, setLoadedEvent] = useState(false);

    const loadStuff = async () => {
        const res = await dispatch(getEventDetailsThunk(eventId));
        dispatch(getGroupDetails(res.groupId));
    }

    useEffect(() => {
        loadStuff();
    }, []);

    if(!group || !event) return <h1>Loading...</h1>

    return (
        <div className='details-ctn'>
            <Link className='back-to-events' to="/events">{back}</Link>
            <div className='event-details-s1'>
                <h1>{event?.name}</h1>
                <h2>Hosted by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</h2>
            </div>
            <div className='event-details-s2'>
                <div className='main-event-img'>
                    <img/>
                </div>
                <div className='group-event-info'>
                    <Link to={`/groups/${group?.id}`}><div className='group-link'>{group?.previewImage}</div></Link>
                    <div className='event-info'>
                        <div className='event-start-end'>
                            <i className="fa-solid fa-clock"></i>
                            <div>
                                <div>
                                    START
                                    <span>{event?.startDate.slice(0, 10)}</span>
                                    <span>{event?.startDate.slice(11, 16)}</span>
                                </div>
                                <div>
                                    END
                                    <span>{event?.endDate.slice(0, 10)}</span>
                                    <span>{event?.endDate.slice(11, 16)}</span>
                                </div>
                            </div>
                        </div>
                        <div className='event-price'>
                            <i className="fa-solid fa-dollar-sign"></i>
                            <div>{event?.price === 0 ? 'FREE' : '$' + event?.price?.toFixed(2)}</div>
                        </div>
                        <div className='event-type'>
                            <i className="fa-solid fa-location-arrow"></i>
                            <div>{event?.type}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='event-details-s3'>
                <h2>Details</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        </div>
    );
}

export default EventDetails;
