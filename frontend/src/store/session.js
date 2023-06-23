import { csrfFetch } from "./csrf";

export const SET_USER = 'store/session/SET_USER';
export function setUser(user) {
    return {
        type: SET_USER,
        user
    }
};
export const setUserThunk = (credentials) => async dispatch => {
    try {
        const response = await csrfFetch('/api/session', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        });

        const res = await response.json();

        if(response.ok){
            dispatch(setUser(res));
        }
    } catch (e) {
        const err = await e.json();
        return err;
    }

}

export const restoreUserThunk = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();

    if(response.ok) dispatch(setUser(data));
    return response;
}



export const REMOVE_USER = 'store/session/REMOVE_USER';
export function removeUser() {
    return {
        type: REMOVE_USER
    }
};
export const removeUserThunk = () => async dispatch => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE'
    });

    if(response.ok) dispatch(removeUser());

    const res = await response.json();
    return res;
}

function sessionReducer(state = { user: null }, action) {
    let newState = {};

    switch (action.type) {
        case SET_USER:
            newState = action.user;
            return newState;
        case REMOVE_USER:
            newState = { user: null };
            return newState;
        default:
            return {...state};
    }
}

export default sessionReducer;
