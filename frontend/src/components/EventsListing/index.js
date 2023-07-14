import './EventsListing.css';

import MyEvents from './MyEvents';
import Listings from '../Listings';
import EventTile from '../EventTile';
import EventDetails from '../EventDetails';

import { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { getEventsThunk } from '../../store/events';
import { useDispatch, useSelector } from 'react-redux';

function EventsListing() {
    const dispatch = useDispatch();

    const eventState = useSelector(state => state.events);
    const eventsArr = Object.values(eventState).sort((a, b) => new Date(a?.startDate) - new Date(b?.startDate));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        dispatch(getEventsThunk());
    }, [dispatch]);

    return (
        <>
            <Switch>
                <Route exact path="/events">
                    <div className="list-ctn">
                        <Listings/>
                        <h2>Events in TeamUp</h2>
                        {eventsArr?.filter(e => new Date(e.startDate) > new Date()).map(e => <EventTile key={e.id} event={e}/> )}
                        {eventsArr?.filter(e => new Date(e.startDate) <= new Date()).map(e => <EventTile key={e.id} event={e}/> )}
                    </div>
                </Route>

                <Route exact path="/events/current">
                        <MyEvents/>
                </Route>

                <Route exact path="/events/:eventId">
                        <EventDetails/>
                </Route>
            </Switch>
        </>
    );
}

export default EventsListing;
