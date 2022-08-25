import React, {useContext} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {ThemeContext} from 'styled-components/native';

const Conatiner = styled.View`
  flex: 1;
`;

const PushModalContainer = styled.View`
  flex-direction: column;
  background-color: ${({theme}) => theme.white};
  shadow-offset: 0px 2px;
  shadow-radius: 8px;
  shadow-color: rgba(0, 0, 0, 0.16);
  border-radius: 16px;
  width: 100%;
  height: 30%;
`;

const PushModalMid = styled.View`
  margin-top: 5%;
  flex: 7;
  align-items: center;
  margin-bottom: 3%;
`;

const PushModalBottom = styled.TouchableOpacity`
  flex: 3;
  background-color: ${({theme}) => theme.pointColor};
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  justify-content: center;
  align-items: center;
`;

const PushModalTxt1 = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({theme}) => theme.dark010};
  font-family: ${({theme}) => theme.fontRegular};
`;

const PushModalTxt2 = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${({theme}) => theme.dark020};
  font-family: ${({theme}) => theme.fontRegular};
`;

const PushModalTxt3 = styled.Text`
  font-size: 16px;
  font-weight: 700;
  color: ${({theme}) => theme.white};
  font-family: ${({theme}) => theme.fontRegular};
`;

const PushModalMargin = styled.View`
  margin-top: 3%;
`;

const BottomTxtContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 5%;
`;

const BottomTxt = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${({theme}) => theme.white};
  font-family: ${({theme}) => theme.fontRegular};
  text-decoration-line: underline;
`;

const PushModal = ({onPressExit, onPressEnd}) => {
  const theme = useContext(ThemeContext);

  console.log('End', onPressEnd);

  const _handleEnd = onOff => {
    // [TODO] Set Alarm
    console.log(onOff);

    onPressExit();
    onPressEnd();
  };

  return (
    <Conatiner>
      <PushModalContainer>
        <PushModalMid>
          <PushModalTxt1>잠깐! ✋</PushModalTxt1>
          <PushModalTxt1>일기장 알림이 꺼져있어요!</PushModalTxt1>
          <PushModalMargin />
          <PushModalTxt2>
            알림을 설정해야 상대방 소식을 받을 수 있어요.
          </PushModalTxt2>
          <PushModalTxt2>지금 설정하시겠습니까?</PushModalTxt2>
        </PushModalMid>
        <PushModalBottom onPress={() => _handleEnd(true)}>
          <PushModalTxt3>네, 알림을 설정합니다.</PushModalTxt3>
        </PushModalBottom>
      </PushModalContainer>
      <TouchableOpacity onPress={() => _handleEnd(false)}>
        <BottomTxtContainer>
          <BottomTxt>아니오, 나중에 할래요</BottomTxt>
        </BottomTxtContainer>
      </TouchableOpacity>
    </Conatiner>
  );
};

PushModal.propTypes = {
  onPressExit: PropTypes.func.isRequired,
};

export default PushModal;
