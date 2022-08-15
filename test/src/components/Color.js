import React, {useState} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import Input from './input';
import Icon from 'react-native-vector-icons/AntDesign';

const Container = styled.View`
  flex: 1;
`;

const chkColorText = color => {
  if (color.charAt(0) != '#') {
    return false;
  }
  if (color.length != 7) {
    return false;
  }
  return true;
};

const Contents = styled.Text`
  flex: 1;
  font-size: 20px;
  color: ${({theme, showcolor}) =>
    chkColorText(showcolor) ? showcolor : theme.btnMainColorBg};
`;

const Color = ({item, deleteColor, updateColor}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [color, setColor] = useState(item.color);

  const _onSubmit = () => {
    if (isEditing) {
      const updatedItem = Object.assign({}, item);
      updatedItem['color'] = color;
      setIsEditing(false);
      updateColor(updatedItem);
    }
  };

  return isEditing ? (
    <Input
      value={color}
      onChangeText={color => setColor(color)}
      onSubmitEditing={_onSubmit}
      onBlur={() => {
        setColor(item.color);
        setIsEditing(false);
      }}
      maxLength={7}
    />
  ) : (
    <Container>
      <Contents showcolor={item.color}>
        {item.color}
        <Icon
          name="edit"
          size={20}
          color="#000000"
          onPress={() => setIsEditing(true)}
        />
        <Icon
          name="delete"
          size={20}
          item={item}
          color="#000000"
          onPress={() => deleteColor(item.id)}
        />
      </Contents>
    </Container>
  );
};

Color.propTypes = {
  item: PropTypes.object.isRequired,
  deleteColor: PropTypes.func.isRequired,
  updateColor: PropTypes.func.isRequired,
};

export default Color;
