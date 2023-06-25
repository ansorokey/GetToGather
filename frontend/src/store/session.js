import { csrfFetch } from "./csrf";

// logging in
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
        return await e.json();
    }

}

// restoring logged in user via cookies
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

// sign up user
export const ADD_USER = '/store/session/ADD_USER';
export function addUser(newUser) {
    return {
        type: ADD_USER,
        newUser
    }
}
export const addUserThunk = (newUser) => async dispatch => {
    try {
        const response = await csrfFetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(newUser)
        });

        if(response.ok){
            const data = await response.json();
            addUser(data);
            return data;
        }
    } catch (e) {
        return await e.json();
    }

}

function sessionReducer(state = { user: null }, action) {
    let newState = {};

    switch (action.type) {
        case SET_USER:
            newState = action.user;
            return newState;
        case ADD_USER:
            newState = { user: {...action.newUser}}
        case REMOVE_USER:
            newState = { user: null };
            return newState;
        default:
            return {...state};
    }
}

export default sessionReducer;
