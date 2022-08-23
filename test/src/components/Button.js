import React from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/AntDesign';

const Container = styled.View`
  padding: 14px;
  flex: 1;
  gap: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

const Title = styled.Text`
  font-size: 18px;
  line-height: 26px;
  color: ${({theme}) => theme.white};
`;

const Button = ({
  title,
  onPress,
  containerStyle,
  textStyle,
  IconType,
  IconColor,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{flexDirection: 'row'}}>
      <Container style={containerStyle}>
        <Title style={textStyle}>
          <Icon
            name={IconType}
            size={21}
            color={IconColor}
            style={{color: IconColor}}
          />
          &nbsp;&nbsp;
          {title}
        </Title>
      </Container>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  textStyle: PropTypes.object,
};

export default Button;
