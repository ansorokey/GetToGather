import { useEffect, useState } from "react";
import EventTile from "../EventTile";
import { useDispatch, useSelector } from "react-redux";
import { getMyEventsThunk } from "../../store/events";
import { useModalContext } from "../../Context/ModalContext";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

function MyEvents() {
    const dispatch = useDispatch();
    const curUser = useSelector(state => state.session.user);

    const {openModal} = useModalContext();

    const [eventsArr, setEventsArr] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadMyEvents() {
        if(curUser) {
            const response = await dispatch(getMyEventsThunk(curUser?.id));
            if(Array.isArray(response)){
                setEventsArr(response);
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMyEvents();
    }, [curUser]);

    if(loading) {
        return <LoadingSpinner/>;
    } else {
        if(!curUser) return <Redirect to='/'/>;
        return <div className="list-ctn">
            <h1>Your Events</h1>
            {(!eventsArr.length) && <h2>You have not joined or started any events</h2>}
            {eventsArr.map(event => { return (
                <EventTile key={event.id} event={event} curUser={curUser} openModal={openModal} myEvents={true} />
            )})}
        </ div>;

    }

}

export default MyEvents;
