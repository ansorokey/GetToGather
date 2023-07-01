import { useParams, Link } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupDetails } from "../../store/groups";
import { getGroupEvents } from '../../store/events';
import { useModalContext } from '../../Context/ModalContext';
import './GroupDetails.css';

import EventTile from "../EventTile";


function GroupDetails() {
    const dispatch = useDispatch();
    const {groupId} = useParams();
    const curUser = useSelector(state => state?.session?.user);
    const group = useSelector(state => state?.groups)[groupId];
    let eventsState = useSelector(state => state?.events);
    const eventsArr = Object.values(eventsState);
    const groupEvents = eventsArr.filter( e => +e?.Group?.id === +groupId );
    const {openModal} = useModalContext();

    const back = '< Back To Groups';

    const ownerButtons = (
        <>
            <button onClick={() => openModal('createEvent', group)}>Create Event</button>
            <button>Update</button>
            <button onClick={() => openModal('deleteGroup', group)}>Delete</button>
        </>
    );

    const guestButtons = (
        <>
            <button onClick={() => alert('Feature coming soon...')}>Join this group</button>
        </>
    );

    useEffect(() => {
        dispatch(getGroupDetails(groupId));
        dispatch(getGroupEvents(groupId));
    }, [dispatch]);

        // if(!groupEvents) return null;

        return (
            <div className='details-ctn'>
                <Link className='back-to-groups' to="/groups">{back}</Link>
                <div className='details-s1'>
                    <div>
                        <img src={group?.previewImage}/>
                    </div>
                    <div>
                        <h1>{group?.name}</h1>
                        <p>{group?.city}, {group?.state}</p>
                        <p>{group?.type}</p>
                        <p>Organized by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</p>
                    </div>

                    <div className='group management'>
                        { +curUser?.id === +group?.organizerId ? ownerButtons : guestButtons}
                    </div>
                </div>

                <div className='details-s2'>
                    <div>
                        <h2>Organizer</h2>
                        <h3>{group?.Organizer?.firstName} {group?.Organizer?.lastName}</h3>
                    </div>

                    <div>
                        <h2>What we're about</h2>
                        <p>{group?.about}</p>
                    </div>
                </div>

                <div className="details-events-ctn">
                    <h2>Events</h2>
                    {groupEvents?.map( event => {
                        return <EventTile key ={event.id} event={event}/> })}
                </div>
            </div>
        );

}

export default GroupDetails;
