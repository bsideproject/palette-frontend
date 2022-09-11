import React, {useContext} from 'react';
import {Button} from '@components';
import styled from 'styled-components/native';
import {View, PermissionsAndroid, Linking, Image} from 'react-native';
import {ThemeContext} from 'styled-components/native';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.fullWhite};
  flex-direction: column;
`;

const InnerContainer = styled.View`
  padding: 0 16px;
`;

const SubTitleText = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 18px;
  margin-top: 30.5px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.View`
  padding: 0 16px;
  margin-bottom: 106px;
`;

const PermissionContainer = styled.View`
  margin: 60px 0 0 22px;
`;

const PermissionBox = styled.View`
  margin-bottom: 30px;
  flex-direction: row;
`;

const PermissionType = styled.Text`
  font-size: 16px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const PermissionDetail = styled.Text`
  font-size: 14px;
  font-family: ${({theme}) => theme.fontRegular};
  color: ${({theme}) => theme.dark030};
`;

const Header = styled.View`
  height: 60px;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.light020};
`;

const Title = styled.Text`
  font-family: ${({theme}) => theme.fontBold};
  font-size: 16px;
  color: ${({theme}) => theme.dark010};
`;

const CAMERA_PERMISSION = require('/assets/icons/camera_permission.png');
const Permission = props => {
  const theme = useContext(ThemeContext);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]).then(result => {
        console.log(result);
        console.log('camera permission', result['android.permission.CAMERA']);
        console.log(
          'storage permission',
          result['android.permission.WRITE_EXTERNAL_STORAGE'],
        );
        if (
          result['android.permission.CAMERA'] === 'granted' &&
          result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
        ) {
          props.onChange();
        } else {
          Linking.openSettings();
        }
      });
    }
  };

  return (
    <Container>
      <KeyboardAvoidingScrollView
        containerStyle={{
          backgroundColor: theme.fullWhite,
        }}
        stickyFooter={
          <ButtonContainer>
            <Button
              title="확인"
              onPress={requestPermission}
              containerStyle={{
                backgroundColor: theme.pointColor,
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
        <Header>
          <Title>권한 설정 안내</Title>
        </Header>
        <InnerContainer>
          <SubTitleText>필수 접근 권한</SubTitleText>
          <PermissionContainer>
            <PermissionBox>
              <Image source={CAMERA_PERMISSION} style={{marginRight: 6}} />
              <View>
                <PermissionType>카메라</PermissionType>
                <PermissionDetail>
                  사진 촬영을 위하여 카메라 접근 권한이 필요합니다.
                </PermissionDetail>
              </View>
            </PermissionBox>
            <PermissionBox>
              <Image source={CAMERA_PERMISSION} style={{marginRight: 6}} />
              <View>
                <PermissionType>저장공간</PermissionType>
                <PermissionDetail>
                  이용 과정에서 기기에 파일을 업로드/다운로드{'\n'}하기 위해
                  저장공간 접근 권한이 필요합니다.
                </PermissionDetail>
              </View>
            </PermissionBox>
          </PermissionContainer>
        </InnerContainer>
      </KeyboardAvoidingScrollView>
    </Container>
  );
};

export default Permission;
