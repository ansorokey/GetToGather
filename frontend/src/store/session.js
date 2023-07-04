import { csrfFetch } from "./csrf";

// logging in
export const SET_USER = 'store/session/SET_USER';
export function setUser(user) {
    return {
        type: SET_USER,
        user
    }
};
export const signin = (credentials) => async dispatch => {
    try {
        const response = await csrfFetch('/api/session', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        });


        if(response.ok){
            const res = await response.json();
            dispatch(setUser(res.user));
        }
    } catch (e) {
        const err = await e.json();
        return err;
    }

}

// restoring logged in user via cookies
export const restoreUserThunk = () => async dispatch => {
    const response = await csrfFetch('/api/session');

    if(response.ok) {
        const data = await response.json();
        dispatch(setUser(data.user));
    }
    return response;
}

export const REMOVE_USER = 'store/session/REMOVE_USER';
export function removeUser() {
    return {
        type: REMOVE_USER
    }
};
export const logout = () => async dispatch => {
    const response = await csrfFetch('/api/session', {
        method: 'DELETE'
    });

    if(response.ok) dispatch(removeUser());

    const res = await response.json();
    return res;
}

// sign up user
export const signup = (newUser) => async dispatch => {
    try {
        const response = await csrfFetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(newUser)
        });

        if(response.ok){
            const data = await response.json();
            dispatch(setUser(data.user));
        }
    } catch (e) {
        // when returned, will not need to be parsed
        return await e.json();
    }

}

function sessionReducer(state = { user: null }, action) {
    let newState = {};

    switch (action.type) {
        case SET_USER:
            newState.user = action.user;
            return newState;
        case REMOVE_USER:
            newState.user = null;
            return newState;
        default:
            return {...state};
    }
}

export default sessionReducer;
