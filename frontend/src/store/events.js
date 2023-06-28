import { csrfFetch } from "./csrf";

export const LOAD_GROUP_EVENTS = 'store/events/LOAD_GROUP_EVENTS';
export function loadGroupEvents(groupId, events) {
    return {
        type: LOAD_GROUP_EVENTS,
        events,
        groupId
    }
}
export const grabGroupEvents = (groupId) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}/events`);
        if(response.ok) {
            const data = await response.json();
            dispatch(loadGroupEvents());
        }
    } catch(e) {
        return e;
    }
}

function eventsReducer(state = {}, action) {
    let newState = {};

    switch(action.type) {
        case LOAD_GROUP_EVENTS:
            // console.log(state);
            newState = {...state};
            newState.byGroup = {...state.byGroup};
            newState.byGroup[action.groupId] = action.events;
            return {...state};
        default:
            return {...state};
    }
}

export default eventsReducer;
