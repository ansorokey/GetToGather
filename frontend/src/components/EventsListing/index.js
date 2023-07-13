import Listings from '../Listings';
import EventTile from '../EventTile';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEventsThunk } from '../../store/events';
import './EventsListing.css';
import EventDetails from '../EventDetails';
import MyEvents from './MyEvents';

function EventsListing() {
    const curUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const eventState = useSelector(state => state.events);
    const eventsArr = Object.values(eventState).sort((a, b) => {
        return new Date(a?.startDate) - new Date(b?.startDate);
    });

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
                        {eventsArr?.filter(e => new Date(e.startDate) > new Date()).map(e => {
                            return <EventTile key={e.id} event={e}/>
                        })}
                        {eventsArr?.filter(e => new Date(e.startDate) <= new Date()).map(e => {
                            return <EventTile key={e.id} event={e}/>
                        })}
                    </div>
                </Route>

                <Route exact path="/events/current">
                { curUser !== null ? <MyEvents/> : <Redirect path="/" /> }
                </Route>

                <Route exact path="/events/:eventId">
                        <EventDetails/>
                </Route>
            </Switch>
        </>
    );
}

export default EventsListing;
