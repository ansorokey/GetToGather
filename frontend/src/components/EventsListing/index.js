import Listings from '../Listings';
import EventTile from '../EventTile';
import { Switch, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEventsThunk } from '../../store/events';
import './EventsListing.css';
import EventDetails from '../EventDetails';
import MyEvents from './MyEvents';

function EventsListing() {
    const dispatch = useDispatch();
    const eventState = useSelector(state => state.events);
    const eventsArr = Object.values(eventState);

    useEffect(() => {
        dispatch(getEventsThunk());
    }, [dispatch]);

    return (
        <>
            <Switch>
                <Route exact path="/events">
                    <div className="list-ctn">
                        <Listings/>
                        {eventsArr.map(e => {
                            return <EventTile key={e.id} event={e}/>
                        })}
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
