import Cookies from 'universal-cookie';
import request from './request'
// const EFP_API_SERVER = `https://staging.efp.betadog.io/campaign/status/BDIPA`;
const FIELD_WITH_PENCES = ['raisedAmountTomorrow', 'sharePriceWithPences', 'targetAmountWithPences']
const EFP_API_SERVER = `http://local.efp.betadog.io:3000`
const AUTH_COOKIE = 'efp_support_admin_user'

// const headers = { Authorization: 'Bearer good-people-drink-good-beer' };
const cookies = new Cookies();

const requestEfpApi = (url, options) => {

  const authCookie = cookies.get(AUTH_COOKIE)
  console.log("efp_support_admin_user cookie ->", authCookie && authCookie.email)
  const headers = {
    Authorization: authCookie ? `Bearer ${authCookie.accessToken}` : null,
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  return request(EFP_API_SERVER + url, { ...options, headers })
}

const attemptLogin = async (email, password) => {
  const requestOptions = {
    method: 'POST',
    body: {
      username: email,
      password,
    },
  };

  const response = await requestEfpApi('/admin/authenticate', requestOptions)
  if (response && response.accessToken) {
    cookies.set(AUTH_COOKIE,
      { accessToken: response.accessToken, email },
      { path: '/' },
    );
    return true
  }
  return false

}

export { requestEfpApi, attemptLogin, FIELD_WITH_PENCES }
