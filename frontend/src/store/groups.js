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

export const ADD_GROUP = 'store/groups/ADD_GROUP';
export function addGroup(group) {
    return {
        type: ADD_GROUP,
        group
    }
}
export const getGroupDetails = (groupId) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}`);

        if(response.ok){
            const data = await response.json();
            dispatch(addGroup(data));
        }
    } catch(e) {
        return e;
    }

}

function groupsReducer(state = {}, action) {
    let newState = {};

    switch(action.type) {
        case LOAD_GROUPS:
            newState = {...state};
            action.groups.forEach(g => {
                if(!(g.id in newState)) {newState[g.id] = g};
            });
            return newState;
        case ADD_GROUP:
            newState = {...state};
            newState[action.group.id] = action.group;
            return newState;
        default:
            return state;
    }
}

export default groupsReducer;
