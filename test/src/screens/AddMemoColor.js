import React, {useContext, useEffect, useState, useRef} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {DB} from '../db_connect';
import Icon from 'react-native-vector-icons/AntDesign';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Button, ErrorMessage} from '../components';
import Spinner from 'react-native-loading-spinner-overlay';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {FlatList} from 'react-native-gesture-handler';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${({theme}) => theme.background};
  padding-right: 5%;
  padding-left: 5%;
  justify-content: space-between;
`;

const SpinnerContainer = styled.Text`
  width: 100%;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const TitleTextContainer = styled.Text`
  padding-left: 5%;
  width: 100%;
  font-size: 20px;
  font-weight: 400;
  margin-top: 10%;
  font-family: ${({theme}) => theme.fontRegular};
`;

const ErrorContainer = styled.View`
  padding-left: 5%;
  margin-bottom: 10%;
  font-family: ${({theme}) => theme.fontRegular};
`;

const NotErrorContainer = styled.View`
  margin-bottom: 10%;
`;

const BtnContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding-right: 5%;
  padding-left: 5%;
  margin-top: 10%;
  margin-bottom: 30%;
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

const ColorContainer = styled.View`
  width: 106px;
  height: 80px;
  margin-right: 6;
  margin-left: 6;
  margin-bottom: 16;
  border-width: ${({BorderWidth}) => BorderWidth};
  border-style: ${({BorderStyle}) => BorderStyle};
  border-color: ${({BorderColor}) => BorderColor};
  border-radius: 6px;
  background-color: ${({theme, MemoColor}) =>
    chkColorText(MemoColor) ? MemoColor : theme.btnMainColorBg};
`;

const ColorTransParent = styled.View`
  background-color: 'transparent';
`;

const AddMemoColor = ({navigation, route}) => {
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const theme = useContext(ThemeContext);
  const receivedName = route.params.name;
  const mounted = useRef(false);
  const numColumns = 3;
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const testColorData = [
    {id: '1', color: '#FFFFFF', selected: 'false'},
    {id: '2', color: '#000000', selected: 'false'},
    {id: '3', color: '#FF0000', selected: 'false'},
    {id: '4', color: '#00FF00', selected: 'false'},
    {id: '5', color: '#0000FF', selected: 'false'},
    {id: '6', color: '#FFFF00', selected: 'false'},
    {id: '7', color: '#00FFFF', selected: 'false'},
    {id: '8', color: '#FF00FF', selected: 'false'},
    {id: '9', color: '#FE2E9A', selected: 'false'},
    {id: '10', color: '#6A0888', selected: 'false'},
    {id: '11', color: '#04B4AE', selected: 'false'},
    {id: '12', color: '#088A4B', selected: 'false'},
    {id: '13', color: '#886A08', selected: 'false'},
    {id: '14', color: '#61210B', selected: 'false'},
    {id: '15', color: '#F781D8', selected: 'false'},
    {id: '16', color: '#BE81F7', selected: 'false'},
    {id: '17', color: '#81DAF5', selected: 'false'},
    {id: '18', color: '#81F79F', selected: 'false'},
    {id: '19', color: '#F5DA81', selected: 'false'},
    {id: '20', color: '#8A0829', selected: 'false'},
  ];

  const getData = async () => {
    // Get From DataBase, Start Spinner
    // End Spinner
    setTimeout(() => {
      setColors(testColorData);
      setIsLoading(false);
      console.log('End Get Data');
    }, 1000);
  };

  const _handleSetCompleteMemo = () => {
    console.log(receivedName, selectedId);
    if (selectedId == null) {
      setErrorMessage('표지 색상을 선택해주세요.');
      setIsError(true);
    } else {
      setIsError(false);
      navigation.navigate('CompleteMemo', {
        name: receivedName,
        colorId: selectedId,
      });
    }
  };

  const formedData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({
        id: `blank-${numberOfElementsLastRow}`,
        color: '#FFFFFF',
        selected: 'false',
        empty: true,
      });
      numberOfElementsLastRow = numberOfElementsLastRow + 1;
    }
    return data;
  };

  const Item = ({item, onPress, borderColor, borderWidth, borderStyle}) => (
    <TouchableOpacity onPress={onPress}>
      <ColorContainer
        MemoColor={item.color}
        BorderColor={borderColor}
        BorderWidth={borderWidth}
        BorderStyle={borderStyle}></ColorContainer>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    if (item.empty === true) {
      return <ColorTransParent></ColorTransParent>;
    }
    const borderColor = item.id === selectedId ? 'red' : 'black';
    const borderWidth = item.id === selectedId ? '3px' : '1px';
    const borderStyle = item.id === selectedId ? 'dotted' : 'solid';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        borderColor={borderColor}
        borderWidth={borderWidth}
        borderStyle={borderStyle}
      />
    );
  };

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      // Start Spinner
      getData();
    }
  }, [colors]);

  return (
    <KeyboardAvoidingScrollView
      stickyFooter={
        <BtnContainer>
          <Button
            title="다음 단계로"
            onPress={_handleSetCompleteMemo}
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
        </BtnContainer>
      }>
      <TitleTextContainer>표시 색상 선택을 해보세요</TitleTextContainer>
      {isError ? (
        <ErrorContainer>
          <ErrorMessage
            message={errorMessage}
            IconColor={theme.inputValidChkColor}
            IconType="exclamationcircleo"
          />
        </ErrorContainer>
      ) : (
        <NotErrorContainer></NotErrorContainer>
      )}
      {isLoading ? (
        <SpinnerContainer>
          <Spinner
            visible={isLoading}
            textContent={'표지 색상 불러오는 중...'}
          />
        </SpinnerContainer>
      ) : (
        <Container>
          <FlatList
            data={formedData(colors, numColumns)}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={numColumns}
            extraData={selectedId}
          />
        </Container>
      )}
    </KeyboardAvoidingScrollView>
  );
};

export default AddMemoColor;
