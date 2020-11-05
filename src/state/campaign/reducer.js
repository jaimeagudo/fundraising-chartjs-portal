import produce from 'immer';
import { DEFAULT_IPOCODE, LOAD_CAMPAIGNS_SUCCESS, LOAD_CAMPAIGNS, LOAD_CAMPAIGNS_ERROR, CHANGE_CAMPAIGN } from './constants';

export const initialState = {
    loading: false,
    error: false,
    current: DEFAULT_IPOCODE,
    campaigns: []
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
    produce(state, draft => {
        switch (action.type) {
            case LOAD_CAMPAIGNS:
                draft.loading = true;
                draft.error = false;
                draft.campaigns = false;
                break;
            case LOAD_CAMPAIGNS_SUCCESS:
                draft.campaigns = action.repos;
                draft.loading = false;
                break;
            case LOAD_CAMPAIGNS_ERROR:
                draft.error = action.error;
                draft.loading = false;
                break;
            case CHANGE_CAMPAIGN:
                draft.current = action.campaign;
                break;
        }
    });

export default appReducer;
