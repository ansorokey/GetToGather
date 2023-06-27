import { csrfFetch } from "./csrf";

export const LOAD_GROUPS = 'store/groups/LOAD_GROUPS';
export function loadGroups(groupsArr) {
    return {
        type: LOAD_GROUPS,
        groups: groupsArr
    }
}
export const loadGroupsThunk = () => async dispatch => {
    try {
        const response = await csrfFetch('/api/groups');

        if(response.ok){
            const groupsArr = await response.json();
            dispatch(loadGroups(groupsArr.Groups));
        }
    } catch(e) {
        return e;
    }
}

function groupsReducer(state = {}, action) {
    let newState = {};

    switch(action.type) {
        case LOAD_GROUPS:
            action.groups.forEach(g => newState[g.id] = g);
            return newState;
        default:
            return newState;
    }
}

export default groupsReducer;
