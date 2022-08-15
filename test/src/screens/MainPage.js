import React, {useContext, useState} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  padding-left: 5%;
  padding-right: 5%;
  background-color: ${({theme}) => theme.background};
`;

const MemoContainer = styled.View`
  flex: 1;
  flex-direction: column;
  margin-top: 10%;
  border-radius: 6px;
  background-color: ${({theme}) => theme.btnMainColorBg};
`;

const Memo_Item1 = styled.View`
  margin-top: 2%;
  flex: 1;
`;

const Item1_Text = styled.Text`
  font-size: 16px;
  margin-top: 10;
  margin-left: 20;
  color: ${({theme}) => theme.btnWhiteFont};
  font-family: ${({theme}) => theme.fontRegular};
`;

const Memo_Item2 = styled.View`
  justify-content: center;
  align-items: center;
  flex: 3;
`;

const Item2_Text = styled.Text`
  font-size: 25px;
  font-weight: 700;
  color: ${({theme}) => theme.btnWhiteFont};
  font-family: ${({theme}) => theme.fontRegular};
`;

const Memo_Item3 = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 3%;
`;

const Item3_Text = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: ${({theme}) => theme.btnWhiteFont};
  font-family: ${({theme}) => theme.fontRegular};
`;

const TitleTextContainer = styled.Text`
  font-size: 20px;
  font-weight: 400;
  padding-left: 5%;
  margin-top: 10%;
  font-family: ${({theme}) => theme.fontRegular};
`;

const PaddingRight = styled.View`
  padding-right: 50;
`;

const MainPage = ({navigation}) => {
  const theme = useContext(ThemeContext);

  return (
    <Container>
      <TouchableOpacity
        onPress={() => navigation.navigate('MemoMain')}
        style={{width: '100%', height: '35%'}}>
        <MemoContainer>
          <Memo_Item1>
            <Item1_Text>
              김 반쪽님의 일기&nbsp;
              <Icon name="star" size={18} color={'#F3B949'} />
            </Item1_Text>
          </Memo_Item1>
          <Memo_Item2>
            <Item2_Text>일기를 시작해 보세요!</Item2_Text>
          </Memo_Item2>
          <Memo_Item3>
            <Item3_Text>
              새 일기장 만들기
              <PaddingRight />|<PaddingRight />
              초대 코드 입력
            </Item3_Text>
          </Memo_Item3>
        </MemoContainer>
      </TouchableOpacity>
    </Container>
  );
};

export default MainPage;
