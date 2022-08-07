import React, {useState, forwardRef} from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  width: 95%;
  padding-left: 5%;
  margin: 10px 0;
`;

const StyledInput = styled.TextInput.attrs(({theme}) => ({
  placeholderTextColor: theme.inputPlaceholder,
}))`
  background-color: ${({theme, editable}) =>
    editable ? theme.inputBackground : theme.inputDisabled};
  color: ${({theme}) => theme.text};
  padding: 20px 10px;
  font-size: 14px;
  font-weight: 400;
  font-family: ${({theme}) => theme.fontRegular};
  border: 1px solid
    ${({theme, isFocused, isError}) =>
      isFocused
        ? isError
          ? theme.inputValidChkColor
          : theme.text
        : theme.inputBorder};
  border-radius: 6px;
`;

const Input = forwardRef(
  (
    {
      value,
      onChangeText,
      onSubmitEditing,
      onBlur,
      placeholder,
      returnKeyType,
      maxLength,
      isPassword,
      disabled,
      isError,
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <Container>
        <StyledInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          placeholder={placeholder}
          returnKeyType={returnKeyType}
          maxLength={maxLength}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="none"
          isFocused={isFocused}
          isError={isError}
          onFocus={() => setIsFocused(true)}
          secureTextEntry={isPassword}
          editable={!disabled}
        />
      </Container>
    );
  },
);

Input.defaultProps = {
  onBlur: () => {},
};

Input.propTypes = {
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  returnKeyType: PropTypes.oneOf(['done', 'next']),
  maxLength: PropTypes.number,
  isPassword: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Input;
