import React from 'react';
import {Modal} from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/AntDesign';

const Container = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const InnerContainer = styled.View`
  width: 310px;
  background-color: white;
  border-radius: 6px;
  elevation: 2;
`;

const TitleText = styled.Text`
  font-size: 16px;
  margin-left: 8px;
`;

const ButtonContainer = styled.TouchableOpacity`
  flex-direction: row;
  padding: 16px;
  align-items: center;
`;

const UploadModal = ({
  visible,
  onClose,
  onLaunchCamera,
  onLaunchImageLibrary,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}>
      <Container onPress={onClose}>
        <InnerContainer>
          <ButtonContainer
            onPress={() => {
              onLaunchCamera();
              onClose();
            }}>
            <Icon name="camera" size={24} color="#757575" />
            <TitleText>카메라로 촬영하기</TitleText>
          </ButtonContainer>
          <ButtonContainer
            onPress={() => {
              onLaunchImageLibrary();
              onClose();
            }}>
            <Icon name="picture" size={24} color="#757575" />
            <TitleText>사진 선택하기</TitleText>
          </ButtonContainer>
        </InnerContainer>
      </Container>
    </Modal>
  );
};

UploadModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UploadModal;
