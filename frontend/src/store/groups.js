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
            console.log(data);
            if(groupData.imgUrl) {
                console.log('pic', typeof groupData.imgUrl)
                console.log('groupId', data.id);
                await csrfFetch(`/api/groups/${data.id}/images`, {
                    method: 'POST',
                    body: JSON.stringify({url: groupData.imgUrl, preview: true})
                });
            }
            return data;
        }
    } catch(e) {
        console.error(e);
        const err = await e.json();
        // console.log('');
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
