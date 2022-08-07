import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/AntDesign';

const StyledText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-left: 2%;
  line-height: 20px;
  color: ${({theme}) => theme.errorText};
`;

const ErrorMessage = ({message, IconColor, IconType}) => {
  return (
    <StyledText>
      <Icon
        name={IconType}
        size={15}
        color={IconColor}
        style={{color: IconColor}}
      />
      &nbsp;&nbsp;
      {message}
    </StyledText>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
