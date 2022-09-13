import {refreshApi} from './restfulAPI';
import {setCookie, getCookie} from './Cookie';

export const _handleRefreshApi = async () => {
  const response = await refreshApi();
  if (response === 'A001') {
    return;
  }
  const {data} = response;
  // Set Access Token -> Cookie
  console.log('Get Access Token Using Refresh Token', data.accessToken);
  setCookie('access_token', data.accessToken);
  return data.accessToken;
};
