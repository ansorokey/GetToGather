import { useParams, Link } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGroupDetails } from "../../store/groups";
import { getGroupEvents } from '../../store/events';
import './GroupDetails.css';

import EventTile from "../EventTile";

function GroupDetails() {
    const dispatch = useDispatch();
    const {groupId} = useParams();
    const group = useSelector(state => state.groups)[groupId];
    let events = useSelector(state => state.events.byGroup);
    let groupEvents = events[groupId];
    const back = '< Back To Groups';

    useEffect(() => {
        dispatch(getGroupEvents(groupId));
        dispatch(getGroupDetails(groupId));
    }, [dispatch]);

        if(!groupEvents) return null;

        return (
            <div className='details-ctn'>
                <Link className='back-to-groups' to="/groups">{back}</Link>
                <div className='details-s1'>
                    <div>
                        <img/>
                    </div>
                    <div>
                        <h1>{group?.name}</h1>
                        <p>{group?.city}, {group?.state}</p>
                        <p>{group?.type}</p>
                        <p>Organized by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</p>
                    </div>
                    <div>
                        <button onClick={() => alert('Feature coming soon...')}>Join this group</button>
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
                    {groupEvents.map( event => {
                        return <EventTile event={event}/> })}
                </div>
            </div>
        );

}

export default GroupDetails;
