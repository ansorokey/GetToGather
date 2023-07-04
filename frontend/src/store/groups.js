import { csrfFetch } from "./csrf";

export const CREATE_GROUP = 'store/groups/CREATE_GROUP';
export function createGroup(group){
    return {
        type: CREATE_GROUP,
        group
    }
}
export const createGroupThunk = (groupData) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/groups`, {
            method: 'POST',
            body: JSON.stringify(groupData)
        });

        if(response.ok){
            const data = await response.json();
            if(groupData.imgUrl) {
                await csrfFetch(`/api/groups/${data.id}/images`, {
                    method: 'POST',
                    body: JSON.stringify({url: groupData.imgUrl, preview: true})
                });
            }
            return data;
        }
    } catch(e) {
        const err = await e.json();
        return err;
    }

}

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
            return data;
        }
    } catch(e) {
        return e;
    }

}

export const DELETE_GROUP = 'store/groups/DELETE_GROUP';
export function deleteGroup(groupId){
    return {
        type: DELETE_GROUP,
        groupId
    }
}
export const deleteGroupThunk = (group) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/groups/${group.id}`, {
            method: 'DELETE'
        });

        if(response.ok){
            dispatch(deleteGroup(group.id));
        }
    } catch(e) {
        const err = await e.json();
        return err;
    }
}
export const UPDATE_GROUP = 'store/groups/UPDATE_GROUP';
export function updateGroup(group) {
    return {
        type: UPDATE_GROUP,
        group
    }
}
export const updateGroupThunk = (groupData, groupId) => async dispatch => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}`, {
            method: 'PUT',
            body: JSON.stringify(groupData)
        });

        if(response.ok){
            const data = await response.json();
            dispatch(addGroup(data));
            return data;
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

        case DELETE_GROUP:
            for(let g in state){
                if(+g !== +action.groupId) newState[g] = state[g];
            }
            return newState;

        default:
            return state;
    }
}

export default groupsReducer;
