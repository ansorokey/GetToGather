import { useEffect, useState } from "react";
import EventTile from "../EventTile";
import { useDispatch, useSelector } from "react-redux";
import { getMyEventsThunk } from "../../store/events";
import { useModalContext } from "../../Context/ModalContext";

function MyEvents() {
    const curUser = useSelector(state => state.session.user);
    const {openModal} = useModalContext();
    const dispatch = useDispatch();

    const [eventsArr, setEventsArr] = useState([]);

    async function loadMyEvents() {
        if(curUser) {
            const response = await dispatch(getMyEventsThunk(curUser?.id));
            if(Array.isArray(response)){
                setEventsArr(response);
            }
        }
    }

    useEffect(() => {
        loadMyEvents();
    }, [curUser]);

    return <div className="list-ctn">
        {eventsArr.map(event => { return (
            <>
                <EventTile key={event.id} event={event} />
                <div className="event-manage-btns">
                    { +event.Group.organizerId === +curUser.id ?
                        <>
                            <button onClick={() => openModal('updateEvent', {type: 'update', event})}>Update</button>
                            <button onClick={() => openModal('deleteEvent', event)}>Delete</button>
                        </>
                        :
                        <button onClick={() => alert('feature coming soon~')}>Cancel Attendance</button>
                    }
                </div>
            </>
        )})}
    </ div>;
}

export default MyEvents;
