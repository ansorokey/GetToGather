import thunk from 'redux-thunk';

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

const rootReducer = combineReducers({
    // add imported reducers here
});

// adds middleware based on running environment
let enhancer;
if(process.env.NODE_ENV === 'production'){
    enhancer = applyMiddleware(thunk);
} else {
    const logger = require('redux-logger').default;
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

//create and export the store with the created middleware
const configureStore = preloadedState => createStore(rootReducer, preloadedState, enhancer);
export default configureStore;