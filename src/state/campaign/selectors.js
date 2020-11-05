import { createSelector } from 'reselect';
import { initialState } from './reducer';

const getState = state => state.campaign || initialState;

/**
 * Select the current campaign
 */
const selectCampaign = () => createSelector(
    getState,
    state => state.current,
);

export { selectCampaign };
