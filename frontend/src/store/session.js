import { csrfFetch } from "./csrf";
import { useDispatch } from "react-redux";

export const SET_USER = 'store/session/SET_USER';
export function setUser(user) {
    return {
        type: SET_USER,
        user
    }
};
export const setUserThunk = (credentials) => async dispatch => {
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials)
    });

    if(response.ok){
        const user = await response.json();
        dispatch(setUser(user));
    } else {
        const error = response.json();
        return error;
    }

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

export default function sessionReducer(state = { user: null }, action) {
    let newState = {};

    switch (action.type) {
        case SET_USER:
            console.log(action.user);
            newState = action.user;
            return newState;
        case REMOVE_USER:
            newState = { user: null };
            return newState;
        default:
            return {...state};
    }
}
