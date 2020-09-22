
const api = {
    // server: process.env.NODE_ENV === 'development' ? 'http://local.efp.betadog.io:3000' : 'https://staging.efp.betadog.io',
    server: 'https://staging.efp.betadog.io',
    fieldsWithPences: ['raisedAmountTomorrow', 'sharePriceWithPences', 'targetAmountWithPences']
}

export default api;

