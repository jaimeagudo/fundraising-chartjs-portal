import request from './request'
import api from '../config/api'


const requestEfpApi = (url, options) => {
  //TODO replace with useAuth
  const persistKey = 'auth';
  const { accessToken } = JSON.parse(localStorage.getItem(persistKey))
  const headers = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
  return request(api.server + url, { ...options, headers })
}

const authenticate = async (email, password) =>
  requestEfpApi('/admin/authenticate', {
    method: 'POST',
    body: JSON.stringify({ username: email, password }),
  })

export default { requestEfpApi, authenticate }
