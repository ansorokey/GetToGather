import { useEffect, useState } from "react";
import EventTile from "../EventTile";
import { useDispatch, useSelector } from "react-redux";
import { getMyEventsThunk } from "../../store/events";
import { useModalContext } from "../../Context/ModalContext";

function MyEvents() {
    const dispatch = useDispatch();
    const curUser = useSelector(state => state.session.user);

    const {openModal} = useModalContext();

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
            <EventTile key={event.id} event={event} curUser={curUser} openModal={openModal} myEvents={true} />
        )})}
    </ div>;
}

export default MyEvents;
