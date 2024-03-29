import './EventDetails.css';

import { getGroupDetails } from '../../store/groups';
import { useModalContext } from '../../Context/ModalContext';
import { useParams, Link } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from 'react';
import { getEventDetailsThunk } from '../../store/events';
import { useDispatch, useSelector } from 'react-redux';

function EventDetails() {
    const { eventId } = useParams();
    const { openModal } = useModalContext();

    const dispatch = useDispatch();

    const curUser = useSelector(state => state.session.user)
    const eventState = useSelector(state => state.events);
    const event = eventState[eventId];
    const groupState = useSelector(state => state.groups);
    let group;
    if(event) group = groupState[event.groupId];

    const loadStuff = async () => {
        const res = await dispatch(getEventDetailsThunk(eventId));
        dispatch(getGroupDetails(res.groupId));
    }

    useEffect(() => {
        loadStuff();
    }, []);

    const back = '< Back To Events';

    if(!group || !event) return <h1>Loading...</h1>

    return (
        <div className='details-ctn'>
            <Link className='back-to-events' to="/events">{back}</Link>
            <div className='event-details-s1'>
                <h1>{event?.name}</h1>
                <h2>Hosted by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</h2>
            </div>
            <div className='event-details-s2'>
                <div className='event-img-ctn'>
                    <img src={event?.previewImage}/>
                </div>
                <div className='group-event-info'>
                    <Link to={`/groups/${group?.id}`}>
                        <div className='group-link'>
                            <img src={group?.previewImage}/>
                            <div className='g-name-g-privacy'>
                                <div className='e-text-header'>{group?.name}</div>
                                <div className='e-text'>{group?.type}</div>
                            </div>
                        </div>
                    </Link>
                    <div className='event-info'>
                        <div className='deet'>
                            <i className="fa-solid fa-clock fa-deet"></i>
                            <div>
                                <div className='event-time'>
                                    <span className='et'>START</span>
                                    <span>{event?.startDate.slice(0, 10)}</span>
                                    <i className="fa-solid fa-circle fa-2xs"></i>
                                    <span>{event?.startDate.slice(11, 16)}</span>
                                </div>
                                <div className='event-time'>
                                    <span className='et'>END</span>
                                    <span>{event?.endDate.slice(0, 10)}</span>
                                    <i className="fa-solid fa-circle fa-2xs"></i>
                                    <span>{event?.endDate.slice(11, 16)}</span>
                                </div>
                            </div>
                        </div>
                        <div className='deet'>
                            <i className="fa-solid fa-dollar-sign fa-deet"></i>
                            <div>{event?.price === 0 ? 'FREE' : '$' +event?.price?.toFixed(2)}</div>
                        </div>
                        <div className='deet'>
                        <i className="fa-solid fa-map-pin fa-deet"></i>
                            <div>{event?.type}</div>
                        </div>
                        <div className='event-btns'>
                            {+curUser?.id === +event?.Group?.organizerId ? <button className='del-event' onClick={() => openModal('updateEvent', {type: 'update', group, event})}>Update</button> : null}
                            {+curUser?.id === +event?.Group?.organizerId ? <button className='del-event' onClick={() => openModal('deleteEvent', event)}>Delete</button> : null}
                        </div>
                    </div>
                </div>
            </div>
            <div className='event-details-s3'>
                <h2>Details</h2>
                <p className='e-text'>{event.description}</p>
            </div>
        </div>
    );
}

export default EventDetails;
