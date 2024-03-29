import './GroupDetails.css';

import { getGroupEvents } from '../../store/events';
import { getGroupDetails } from "../../store/groups";
import { useModalContext } from '../../Context/ModalContext';
import { useParams, Link } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import EventTile from "../EventTile";


function GroupDetails() {
    const dispatch = useDispatch();

    const {groupId} = useParams();
    const {openModal} = useModalContext();

    const curUser = useSelector(state => state?.session?.user);
    const group = useSelector(state => state?.groups)[groupId];

    const [groupEvents, setGroupEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [pastEvents, setPastEvents] = useState([]);

    const back = '< Back To Groups';

    const ownerButtons = (
        <>
            <button onClick={() => openModal('createEvent', group)}>Create Event</button>
            <button onClick={() => openModal('updateGroup', {type: 'update', group})}>Update</button>
            <button onClick={() => openModal('deleteGroup', group)}>Delete</button>
        </>
    );

    const guestButtons = (
        <>
            <button className='join-group' onClick={() => alert('Feature coming soon...')}>Join this group</button>
        </>
    );

    async function initialLoad(){
        dispatch(getGroupDetails(groupId));
        const eventResponse = await dispatch(getGroupEvents(groupId));
        if(Array.isArray(eventResponse)) {
            setGroupEvents(eventResponse);
            setUpcomingEvents(() => {
                return eventResponse?.filter( event => {
                    const eDate = new Date(event?.startDate);
                    const now = new Date();
                    return (eDate > now);
                });
            });

            setPastEvents(() => {
                return eventResponse?.filter( event => {
                    const eDate = new Date(event?.startDate);
                    const now = new Date();
                    return (eDate < now) });
            });
        }
    }

    useEffect(() => {
        initialLoad();
    }, []);

    return (
        <div className='details-ctn'>
            <Link className='back-to-groups' to="/groups">{back}</Link>
            <div className='details-s1'>
                <div className="group-img-ctn">
                    <img src={group?.previewImage}/>
                </div>
                <div className='about-group'>
                    <div className="g-info">
                        <h1>{group?.name}</h1>
                        <p>{group?.city}, {group?.state}</p>
                        <div className='members-type group-num-events-private'>
                            <span>{group?.Events?.length} events</span>
                            <i className="fa-solid fa-circle fa-2xs"></i>
                            <span>{group?.private === true ? 'Private' : 'Public'}</span>
                        </div>
                        <p>Organized by {group?.Organizer?.firstName} {group?.Organizer?.lastName}</p>
                    </div>

                    <div className='group-management'>
                        { +curUser?.id === +group?.organizerId ? ownerButtons : curUser !== null ? guestButtons : null}
                    </div>
                </div>

            </div>

            <div className='details-s2'>
                <div>
                    <h2>Organizer</h2>
                    <h3>{group?.Organizer?.firstName} {group?.Organizer?.lastName}</h3>
                </div>

                <div>
                    <h2>What we're about</h2>
                    <p className="g-about">{group?.about}</p>
                </div>
            </div>

            <div className="details-events-ctn">
                {upcomingEvents?.length ?
                    <>
                        <h2>Upcoming Events ({upcomingEvents?.length})</h2>
                        {upcomingEvents?.map( event => <EventTile key={event?.id} event={event}/>)}
                    </> : <h2>No upcoming events</h2>
                }

                {pastEvents?.length ?
                    <>
                        <h2>Past Events </h2>
                        {pastEvents?.reverse()?.map( event => <EventTile key={event?.id} event={event}/>)}
                    </> : null
                }
            </div>
        </div>
    );

}

export default GroupDetails;
