import { combineReducers } from 'redux';
import campaign from './campaign/reducer';

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
    const rootReducer = combineReducers({
        campaign,
        ...injectedReducers,
    });

    return rootReducer;
}
