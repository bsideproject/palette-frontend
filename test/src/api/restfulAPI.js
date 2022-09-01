import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export const refreshApi = async () => {
  const refreshToken = AsyncStorage.getItem('refresh_token');
  if (refreshToken) {
    try {
      const response = await axios.post(
        'http://61.97.190.252:8080/api/v1/token',
        {
          headers: {
            Cookie: refreshToken,
          },
        },
      );
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
    const response = await axios.post(
      'http://61.97.190.252:8080/api/v1/login',
      {
        email: email,
        socialType: socialType,
      },
    );
    return response;
  } catch (error) {
    console.log('login error', error);
  }
};

export const logoutApi = async () => {
  const refreshToken = AsyncStorage.getItem('refresh_token');
  if (refreshToken) {
    try {
      const response = await axios.get(
        'http://61.97.190.252:8080/api/v1/logout',
        {
          headers: {
            Cookie: refreshToken,
          },
        },
      );
      return response;
    } catch (error) {
      console.log('logout error', error.message);
    }
  }
};

export const imageUploadApi = async (uploadImage, accessToken) => {
  try {
    const response = await axios.post(
      'http://61.97.190.252:8080/api/v1/upload',
      uploadImage,
      {
        headers: {
          authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response;
  } catch (error) {
    console.log('imageUpload error', error);
  }
};
