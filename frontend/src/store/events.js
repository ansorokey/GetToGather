import { csrfFetch } from "./csrf";

export const GET_EVENTS = 'store/events/GET_EVENTS';
export function getEvents(events) {
    return {
        type: GET_EVENTS,
        events
    }
};
export const getEventsThunk = () => async dispatch => {
    try {
        const response = await csrfFetch('/api/events');
        if(response.ok){
            const data = await response.json();
            dispatch(getEvents(data.Events));
        }
    } catch(e) {
        return e;
    }
}

export const GET_EVENT_DETAILS = 'store/events/GET_EVENT_DETAILS';
export function getEventDetails(event){
    return {
        type: GET_EVENT_DETAILS,
        event
    }
}
export const getEventDetailsThunk = (eventId) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/events/${eventId}`);
        if(response.ok){
            const data = await response.json();
            dispatch(getEventDetails(data));
            return data;
        }
    } catch (e) {
        return e;
    }
}

export const LOAD_GROUP_EVENTS = 'store/group/LOAD_GROUP_EVENTS';
export function loadGroupEvents(groupId, events) {
    return {
        type: LOAD_GROUP_EVENTS,
        groupId,
        events
    }
}
export const getGroupEvents = (groupId) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}/events`);
        if(response.ok) {
            const data = await response.json();
            const events = data.Events;
            dispatch(loadGroupEvents(groupId, events))
        }
    } catch(e) {
        return e;
    }
}

function eventsReducer(state = { byGroup: {}, allEvents: {}}, action) {
    let newState;

    switch(action.type) {
        case GET_EVENTS:
            newState = {...state};
            action.events.forEach(e => {
                if(!(e.id in newState.allEvents)) newState.allEvents[e.id] = e});
            return newState;

        case GET_EVENT_DETAILS:
            newState = {...state};
            newState.allEvents[action.event.id] = action.event;
            return newState;

        case LOAD_GROUP_EVENTS:
            newState = {...state};
            newState.byGroup = {...state.byGroup};
            newState.byGroup[action.groupId] = [...action.events];
            return newState;

        default:
            return state;
    }
}

export default eventsReducer;
