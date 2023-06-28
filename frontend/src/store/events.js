import { csrfFetch } from "./csrf";

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

function eventsReducer(state = { byGroup: {}}, action) {
    let newState;

    switch(action.type) {
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
