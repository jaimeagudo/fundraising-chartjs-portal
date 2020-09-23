
const LOCAL_SERVER = "http://local.efp.betadog.io:3000"
const DEV_SERVER = "https://dev.efp.betadog.io/api"
const STAGING_SERVER = "https://staging.efp.betadog.io/api"
const PROD_SERVER = "https://prod.efp.betadog.io/api"

const api = {
    server: process.env.NODE_ENV === 'development' ? STAGING_SERVER : STAGING_SERVER,
    // server: STAGING_SERVER,
    fieldsWithPences: ['raisedAmountTomorrow', 'sharePriceWithPences', 'targetAmountWithPences']
}

export default api;

