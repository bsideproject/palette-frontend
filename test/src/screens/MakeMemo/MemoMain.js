import React, {useContext, useState} from 'react';
import styled from 'styled-components/native';
import {Button, Input, ErrorMessage} from '@components';
import {ThemeContext} from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${({theme}) => theme.background};
  justify-content: center;
  align-items: center;
`;

const BtnContainier = styled.View`
  width: 78.66%;
`;

const BtnMargin_1 = styled.View`
  margin-bottom: 9%;
`;

const BtnMargin_2 = styled.View`
  margin-bottom: 45%;
`;

const MemoMain = ({navigation}) => {
  const theme = useContext(ThemeContext);

  const _handleMoveAddPage = () => {
    navigation.navigate('AddMemo');
  };

  const _handleMoveInvitePage = () => {
    navigation.navigate('AddInviteCode');
  };

  return (
    <Container>
      <BtnContainier>
        <BtnMargin_1>
          <Button
            title="새 일기장 만들기"
            onPress={_handleMoveAddPage}
            IconColor={theme.btnWhiteFont}
            IconType="book"
            containerStyle={{
              backgroundColor: theme.btnMainColorBg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            textStyle={{
              color: theme.btnWhiteFont,
              fontSize: 18,
              fontWeight: '700',
              fontFamily: theme.fontRegular,
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </BtnMargin_1>

        <BtnMargin_2>
          <Button
            title="초대코드 입력하기"
            onPress={_handleMoveInvitePage}
            IconColor={theme.btnMainColorBg}
            IconType="mail"
            containerStyle={{
              backgroundColor: theme.btnWhiteColorBg,
              borderColor: theme.btnMainColorBg,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            textStyle={{
              color: theme.btnMainFont,
              fontSize: 18,
              fontWeight: '700',
              fontFamily: theme.fontRegular,
              textAlign: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </BtnMargin_2>
      </BtnContainier>
    </Container>
  );
};

export default MemoMain;
