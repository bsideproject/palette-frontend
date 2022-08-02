import React, {useContext, useState} from 'react';
import styled from 'styled-components/native';
import {DB} from '../db_connect';
import Icon from 'react-native-vector-icons/AntDesign';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import Modal from 'react-native-simple-modal';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
`;

const TopStyle = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
`;

const IconContainer = styled.View`
  background-color: ${({theme}) => theme.iconBackground};
  padding: 10px 10px;
  border-radius: 10px;
  margin-top: 15px;
  margin-right: 10px;
`;

const LogoContainer = styled.View`
  background-color: ${({theme}) => theme.iconBackground};
  width: 40%;
  height: 20%;
  margin-top: 40%;
  margin-left: 30%;
  justify-content: center;
`;

const ModalContainer = styled.View`
  background-color: ${({theme}) => theme.modalBackground};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ModalItem = styled.View`
  border-width: 1;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const Sub = ({navigation}) => {
  const [showTip, setTip] = useState(false);
  const [showModal, setModal] = useState(false);

  const _handleMoveAddPage = () => {
    navigation.navigate('AddMemo');
    setTimeout(() => {
      setModal(false);
    }, 1000);
  };

  const _handleMoveInvitePage = () => {
    navigation.navigate('AddInviteCode');
    setTimeout(() => {
      setModal(false);
    }, 1000);
  };

  return (
    <Container>
      <TopStyle>
        <Tooltip
          isVisible={showTip}
          content={
            <View>
              <Text> 첫 일기장을 생성해보세요 </Text>
            </View>
          }
          onClose={() => setTip(false)}
          placement="bottom"
          // below is for the status bar of react navigation bar
        >
          <TouchableOpacity onPress={() => setTip(true)}>
            <IconContainer>
              <Icon name="questioncircle" size={30} color="#000000" />
            </IconContainer>
          </TouchableOpacity>
        </Tooltip>

        <TouchableOpacity onPress={() => setModal(true)}>
          <IconContainer>
            <Icon name="pluscircle" size={30} color="#000000" />
          </IconContainer>
        </TouchableOpacity>
        <TouchableOpacity>
          <IconContainer>
            <Icon name="minussquareo" size={30} color="#000000" />
          </IconContainer>
        </TouchableOpacity>
      </TopStyle>

      <LogoContainer>
        <Text
          style={{
            fontSize: 50,
            textAlign: 'center',
          }}>
          로고
        </Text>
      </LogoContainer>

      <Modal
        open={showModal}
        offset={0}
        overlayBackground={'rgba(0, 0, 0, 1)'}
        animationDuration={200}
        animationTension={40}
        useNativeDriver={true}
        modalDidOpen={() => undefined}
        modalDidClose={() => setModal(false)}
        closeOnTouchOutside={true}
        containerStyle={{justifyContent: 'center'}}
        modalStyle={{
          borderRadius: 2,
          backgroundColor: '#ffffff',
          width: '90%',
          height: '20%',
          marginBottom: '30%',
        }}
        disableOnBackPress={false}>
        <ModalContainer>
          <TouchableOpacity
            onPress={_handleMoveAddPage}
            style={{width: '100%', height: '45%'}}>
            <ModalItem>
              <Text>새로 만들기</Text>
            </ModalItem>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={_handleMoveInvitePage}
            style={{width: '100%', height: '45%', marginBottom: 10}}>
            <ModalItem style={{marginTop: 10}}>
              <Text>초대 코드 입력</Text>
            </ModalItem>
          </TouchableOpacity>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

export default Sub;
