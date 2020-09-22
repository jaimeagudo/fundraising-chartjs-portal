import request from './request'
// const EFP_API_SERVER = `https://staging.efp.betadog.io/campaign/status/BDIPA`;
const FIELD_WITH_PENCES = ['raisedAmountTomorrow', 'sharePriceWithPences', 'targetAmountWithPences']
const EFP_API_SERVER = `http://local.efp.betadog.io:3000`
// const EFP_API_SERVER = `http://local.efp.betadog.io:4000`
//const accessToken= 'good-people-drink-good-beer'

const requestEfpApi = (url, options) => {
  //TODO replace with useAuth
  const persistKey = 'auth';
  const { accessToken } = JSON.parse(localStorage.getItem(persistKey))
  const headers = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  return request(EFP_API_SERVER + url, { ...options, headers })
}

const authenticate = async (email, password) =>
  requestEfpApi('/admin/authenticate', {
    method: 'POST',
    body: JSON.stringify({ username: email, password }),
  })

export default { requestEfpApi, authenticate, FIELD_WITH_PENCES }
