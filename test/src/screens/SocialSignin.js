import React from 'react';
import {Button} from '../components';
import {WebView} from 'react-native-webview';
import {StyleSheet, Platform, Text, View} from 'react-native';
import axios from 'axios';

const runFirst = `window.ReactNativeWebView.postMessage("this is message from web");`;
const SocialSignin = ({navigation, route}) => {
  const {socialUrl} = route.params;
  const parseAuthCode = async (url) => {
    const exp = 'code='; //url에 붙어 날라오는 인가코드는 code=뒤부터 parse하여 get
    const startIndex = url.indexOf(exp); //url에서 "code="으로 시작하는 index를 찾지 못하면 -1반환
    if (startIndex !== -1) {
      const authCode = url.substring(startIndex + exp.length);
      console.log('access code :: ' + authCode);
      alert('access code :: ' + authCode);

      // await axios
      //   .post('서버 url 경로', {
      //     params: {
      //       code: authCode,
      //     },
      //   })
      //   .then(res =>
      //     AsyncStorage.setItem(
      //       'userNumber',
      //       JSON.stringify(res['data']['userId']),
      //     ),
      //   );

      navigation.navigate('Signin');
      // navigate('Home', {screen: 'Home'});
    }
  };
  return (
    <View style={{flex: 1}}>
      <WebView
        originWhitelist={['*']}
        scalesPageToFit={false}
        source={{
          uri: socialUrl,
        }}
        javaScriptEnabled={true}
        injectedJavaScript={runFirst}
        onMessage={event => {
          parseAuthCode(event.nativeEvent['url']);
        }}
      />
    </View>
  );
};

export default SocialSignin;
