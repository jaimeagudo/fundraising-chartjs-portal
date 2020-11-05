import { LOAD_CAMPAIGNS_SUCCESS, LOAD_CAMPAIGNS, LOAD_CAMPAIGNS_ERROR, CHANGE_CAMPAIGN } from './constants';

/**
 * Load the campaings, this action starts the request saga
 *
 * @return {object} An action object with a type of LOAD_CAMPAIGNS
 */
export function loadCampaigns() {
    return {
        type: LOAD_CAMPAIGNS,
    };
}

/**
 * Dispatched when the campaings are loaded by the request saga
 *
 * @param  {array} campaigns
 *
 * @return {object}      An action object with a type of LOAD_CAMPAIGNS_SUCCESS passing the campaigns
 */
export function campaignsLoaded(campaigns) {
    return {
        type: LOAD_CAMPAIGNS_SUCCESS,
        campaigns,
    };
}

/**
 * Dispatched when loading the campaings fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of LOAD_CAMPAIGNS_ERROR passing the error
 */
export function campaignsLoadingError(error) {
    return {
        type: LOAD_CAMPAIGNS_ERROR,
        error,
    };
}

/**
 * Change the campaing
 *
 * @return {object} An action object with a type of CHANGE_CAMPAIGN
 */
export function changeCampaign(campaign) {
    return {
        type: CHANGE_CAMPAIGN,
        campaign
    };
}
