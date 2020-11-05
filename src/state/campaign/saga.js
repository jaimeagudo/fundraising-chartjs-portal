import { call, put, takeLatest } from 'redux-saga/effects';
import { LOAD_CAMPAIGNS } from './constants';
import efpApiClient from '../../services/efpApiClient';
import { campaignsLoaded, campaignsLoadingError } from './actions';

export function* getCampaigns() {

    try {
        const campaigns = yield call([efpApiClient, efpApiClient.requestEfpApi], '/campaigns')
        yield put(campaignsLoaded(campaigns))
    } catch (err) {
        yield put(campaignsLoadingError(err));
    }
}

export default function* saga() {
    yield takeLatest(LOAD_CAMPAIGNS, getCampaigns);
}
