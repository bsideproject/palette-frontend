import axios from 'axios';
import {getCookie} from './Cookie';
import {_handleRefreshApi} from './tokenAPI';

export const axiosApiInstance = axios.create();

//Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async config => {
    const accessToken = getCookie('access_token');
    config.headers = {
      authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    };
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  response => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await _handleRefreshApi();

      // Set Access token from cookie
      originalRequest.headers['Authorization'] =
        'Bearer ' + getCookie('access_token');
      console.log('OR-Axios Token Expired: ', originalRequest);
      return axios(originalRequest);
    }
    return Promise.reject(error);
  },
);
