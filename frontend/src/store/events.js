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
            dispatch(loadGroupEvents(groupId, events));
            return events;
        }
    } catch(e) {
        return e;
    }
}

export const CREATE_EVENT = 'store/events/CREATE_EVENT';
export function createEvent(event) {
    return {
        type: CREATE_EVENT,
        event
    }
}
export const createEventThunk = (eventData) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/groups/${eventData.groupId}/events`, {
            method: 'POST',
            body: JSON.stringify(eventData)
        });

        if(response.ok){
            const data = await response.json();
            await csrfFetch(`/api/events/${data.id}/images`, {
                method: 'POST',
                body: JSON.stringify({url: eventData.imgUrl, preview: true})
            });
            dispatch(createEvent(data));
            dispatch(getEventDetails(data));
            return data;
        }
    } catch (e) {
        const err = await e.json();
        return err;
    }
}

export const DELETE_EVENTS = 'store/events/DELETE_EVENTS';
export function deleteEvents(groupId) {
    return {
        type: DELETE_EVENTS,
        groupId
    }
}
export const deleteEventsThunk = (group) => async dispatch => {
    dispatch(deleteEvents(group.id));
}

export const REMOVE_SINGLE_EVENT = 'store/events/REMOVE_SINGLE_EVENT';
export function removeSingleEvent(eventId) {
    return {
        type: REMOVE_SINGLE_EVENT,
        eventId
    }
}
export const removeSingleEventThunk = (eventId) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/events/${eventId}`, {
            method: 'DELETE'
        });

        if(response.ok) {
            dispatch(removeSingleEvent(eventId));
        }
    } catch (e) {
        return e;
    }
}

function eventsReducer(state = {}, action) {
    let newState = {};

    switch(action.type) {
        case GET_EVENTS:
            newState = {...state};
            action.events.forEach(e => {
                newState[e.id] = Object.assign({...e}, {...newState[e.id]})});
            return newState;

        case GET_EVENT_DETAILS:
            newState = {...state};
            newState[action.event.id] = Object.assign({...newState[action.event.id]}, {...action.event});
            return newState;

        case LOAD_GROUP_EVENTS:
            newState = {...state};
            action.events.forEach(e => newState[e.id] = e);
            return newState;

        case CREATE_EVENT:
            newState = {...state};
            newState[action.event.groupId] = action.event;
            return newState;

        case DELETE_EVENTS:
            for(let key in state){
                if(+state[key].groupId !== +action.groupId) newState[key] = state[key];
            }
            return newState;

        case REMOVE_SINGLE_EVENT:
            for(let key in state){
                if(+state[key].id !== +action.eventId) newState[key] = state[key];
            }
            return newState;

        default:
            return state;
    }
}

export default eventsReducer;
