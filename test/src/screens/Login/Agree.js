import React, {useContext, useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {Button} from '@components';
import {TouchableOpacity, View, Text, Image} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import Icon from 'react-native-vector-icons/AntDesign';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {USE_MUTATION} from '@apolloClient/queries';
import AsyncStorage from '@react-native-community/async-storage';
import {ErrorAlert} from '@components';
import Spinner from 'react-native-loading-spinner-overlay';
import {Flow} from 'react-native-animated-spinkit';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 0 16px;
`;

const WelcomeContainer = styled.View`
  margin-top: 30px;
`;

const WelcomeText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 20px;
`;

const AgreeContainer = styled.View`
  margin-top: 48px;
  margin-bottom: 237px;
`;

const AllAgreeText = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 18px;
`;

const AgreeTextContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 37px;
  padding: 0 49px 0 40px;
`;

const AgreeText = styled.Text`
  font-family: ${({theme}) => theme.fontRegular};
  font-size: 18px;
`;

const ButtonContainer = styled.View`
  padding: 0 16px;
  margin-bottom: 106px;
`;

const SpinnerContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const Agree = ({navigation}) => {
  const [allCheck, setAllCheck] = useState(false);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const theme = useContext(ThemeContext);
  const [accessToken, setAccessToken] = useState(null);
  const [updateProfile, {data, loading, error}] = USE_MUTATION(
    'UPDATE_PROFILE',
    accessToken,
  );
  const [isLoading, setIsLoading] = useState(false);
  const CHECKBOX_DEFAULT = require('/assets/icons/checkbox_default.png');
  const CHECKBOX_SELECTED = require('/assets/icons/checkbox_selected.png');

  const toggleAllCheck = () => {
    setAllCheck(prev => {
      if (!prev) {
        setCheck1(true);
        setCheck2(true);
      } else {
        setCheck1(false);
        setCheck2(false);
      }
      return !prev;
    });
  };

  const toggleCheck1 = () => {
    setCheck1(prev => !prev);
  };

  const toggleCheck2 = () => {
    setCheck2(prev => !prev);
  };

  const _handleNavFirstExplain = () => {
    navigation.navigate('FirstExplain');
  };

  const _handleNavSecondExplain = () => {
    navigation.navigate('SecondExplain');
  };

  const _handleNextButtonPress = () => {
    setIsLoading(true);
    updateProfile({
      variables: {agreeWithTerms: true},
    });
  };

  const CheckBox = ({check}) => {
    return check ? (
      <Image source={CHECKBOX_SELECTED} style={{marginRight: 10}} />
    ) : (
      <Image source={CHECKBOX_DEFAULT} style={{marginRight: 10}} />
    );
  };

  useEffect(() => {
    AsyncStorage.getItem('access_token', (err, result) => {
      setAccessToken(result);
    });
  }, []);

  useEffect(() => {
    if (check1 && check2) {
      setAllCheck(true);
    } else {
      setAllCheck(false);
    }
  }, [check1, check2]);

  useEffect(() => {
    if (error != undefined) {
      let jsonData = JSON.parse(JSON.stringify(error));
      console.log(jsonData);
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // Not Check Data Is True..
      console.log('Data', data);
      setIsLoading(false);
      navigation.navigate('Nickname');
    }
  }, [loading]);

  return isLoading ? (
    <SpinnerContainer>
      <Flow animating={isLoading} size={100} color={theme.pointColor} />
    </SpinnerContainer>
  ) : (
    <Container>
      <KeyboardAvoidingScrollView
        containerStyle={{
          backgroundColor: theme.fullWhite,
        }}
        stickyFooter={
          <ButtonContainer pointerEvents={check1 && check2 ? 'auto' : 'none'}>
            <Button
              title="다음 단계로"
              onPress={_handleNextButtonPress}
              containerStyle={{
                backgroundColor:
                  check1 && check2 ? theme.pointColor : theme.dark040,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              textStyle={{
                color: theme.white,
                fontSize: 18,
                fontWeight: '700',
                fontFamily: theme.fontRegular,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </ButtonContainer>
        }>
        <InnerContainer>
          <WelcomeContainer>
            <WelcomeText>만나서 반갑습니다 :)</WelcomeText>
            <View style={{flexDirection: 'row'}}>
              <WelcomeText style={{color: theme.success}}>이용약관</WelcomeText>
              <WelcomeText>을 확인해 주세요</WelcomeText>
            </View>
          </WelcomeContainer>
          <AgreeContainer>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={toggleAllCheck}>
                <CheckBox check={allCheck} />
              </TouchableOpacity>
              <AllAgreeText>전체 내용에 동의합니다.</AllAgreeText>
            </View>
            <View
              style={{
                height: 1,
                marginTop: 24,
                marginBottom: 19,
                backgroundColor: theme.light010,
              }}
            />
            <AgreeTextContainer>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={toggleCheck1}>
                  <CheckBox check={check1} />
                </TouchableOpacity>
                <AgreeText>이용약관</AgreeText>
              </View>
              <TouchableOpacity onPress={_handleNavFirstExplain}>
                <Icon name={'right'} size={15} color={theme.dark010} />
              </TouchableOpacity>
            </AgreeTextContainer>
            <AgreeTextContainer>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={toggleCheck2}>
                  <CheckBox check={check2} />
                </TouchableOpacity>
                <AgreeText>개인정보 취급방침</AgreeText>
              </View>
              <TouchableOpacity onPress={_handleNavSecondExplain}>
                <Icon name={'right'} size={15} color={theme.dark010} />
              </TouchableOpacity>
            </AgreeTextContainer>
          </AgreeContainer>
        </InnerContainer>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default Agree;
