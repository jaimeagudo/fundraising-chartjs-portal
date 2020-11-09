import { call, all, spawn } from 'redux-saga/effects';
import campaign from './campaign/saga';

/**
 * Merges the sagas
 */
function* rootSaga() {
    const sagas = [
        campaign
    ];

    yield all(sagas.map(saga =>
        spawn(function* () {
            while (true) {
                try {
                    yield call(saga)
                    break
                } catch (e) {
                    console.eror(e)
                }
            }
        }))
    );
}

export default rootSaga
