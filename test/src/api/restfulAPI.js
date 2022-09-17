import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import {ErrorAlert} from '@components';
import {getCookie} from './Cookie';
import {axiosApiInstance} from './axiosAPI';

const API_URL = 'http://61.97.190.252:8080/api/v1';

export const refreshApi = async () => {
  const refreshToken = await AsyncStorage.getItem('refresh_token');
  // console.log('Read Refresh Token From Async Storage', refreshToken);
  if (refreshToken) {
    try {
      const response = await axios.post(API_URL + '/token', {
        headers: {
          Cookie: refreshToken,
        },
      });
      return response;
    } catch (error) {
      console.log('error....', JSON.stringify(error));
      //리프레쉬 토큰 만료시, 쿠키에 더미값을 넣어도 axios 성공;;
      return 'A001';
    }
  }
};

export const loginApi = async (email, socialType) => {
  try {
    const response = await axios.post(API_URL + '/login', {
      email: email,
      socialType: socialType,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const logoutApi = async () => {
  const refreshToken = await AsyncStorage.getItem('refresh_token');
  if (refreshToken) {
    try {
      const response = await axios.get(API_URL + '/logout', {
        headers: {
          Cookie: refreshToken,
        },
      });
      return response;
    } catch (error) {
      console.log('logout error', error.message);
    }
  }
};

export const delUserApi = async token => {
  try {
    await axiosApiInstance.delete(API_URL + '/user', {
      headers: {
        authorization: `Bearer ${getCookie('access_token')}`,
      },
    });
  } catch (error) {
    console.log('계정 탈퇴 api 에러');
  }
};

export const imageUploadApi = async (uploadImage, accessToken) => {
  try {
    const response = await axiosApiInstance.post(
      API_URL + '/upload',
      uploadImage,
      {
        headers: {
          authorization: `Bearer ${getCookie('access_token')}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response;
  } catch (error) {
    console.log('imageUpload error', error);
    ErrorAlert();
    return 'Error';
  }
};

export const imageDeleteApi = async (urls, accessToken) => {
  try {
    let delUrls = '';
    urls.forEach(url => {
      delUrls = 'url=' + url + '&';
    });
    await axiosApiInstance.delete(API_URL + '/files?' + delUrls, {
      headers: {
        authorization: `Bearer ${getCookie('access_token')}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.log('imageUpload error', error);
    ErrorAlert();
    return 'Error';
  }
};
