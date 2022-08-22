import React, {useContext, useEffect, useState, useRef} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {TouchableOpacity} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {FlatList} from 'react-native-gesture-handler';
import {useQuery, useMutation} from '@apollo/client';
import {COLOR_CODE, REGISTER_MEMO} from '@apolloClient/queries';
import {UserContext} from '@contexts';
import {Button, ErrorMessage} from '@components';
import LinearGradient from 'react-native-linear-gradient';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${({theme}) => theme.background};
  padding-right: 5%;
  padding-left: 5%;
  align-items: center;
  justify-content: space-between;
`;

const SpinnerContainer = styled.Text`
  flex: 1;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-family: ${({theme}) => theme.fontRegular};
`;

const TitleTextContainer = styled.Text`
  padding-left: 5%;
  width: 100%;
  font-size: 20px;
  font-weight: 400;
  margin-top: 5%;
  font-family: ${({theme}) => theme.fontRegular};
`;

const ErrorContainer = styled.View`
  padding-left: 5%;
  margin-bottom: 5%;
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

const ColorTransParent = styled.View`
  background-color: 'transparent';
`;

const AddMemoColor = ({navigation, route}) => {
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const theme = useContext(ThemeContext);
  const receivedName = route.params.name;
  const numColumns = 3;
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const {loading, error, data} = useQuery(COLOR_CODE);
  const {user} = useContext(UserContext);
  const [registerMemo, registerResult] = useMutation(REGISTER_MEMO, {
    context: {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  });
  //console.log(user);

  const getData = () => {
    // Get From DataBase, Start Spinner
    console.log('Get Data From QraphQL');
    // console.log(loading, error, data);

    if (!loading) {
      readData = [];
      data['color'].map(item => {
        readData.push({
          id: item.id,
          order: item.order,
          startCode: item.startCode,
          endCode: item.endCode,
        });
      });
      setIsLoading(false);
      setColors(readData);
      console.log(readData);
    }
  };

  const _handleSetCompleteMemo = () => {
    console.log(receivedName, selectedColor);

    if (selectedColor == null) {
      setErrorMessage('표지 색상을 선택해주세요.');
      setIsError(true);
    } else {
      setIsError(false);

      console.log('Set Memo: ', receivedName, selectedColor.id);
      console.log('token: ', user.accessToken);

      registerMemo({
        variables: {
          title: receivedName,
          colorId: selectedColor.id,
        },
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
        empty: true,
      });
      numberOfElementsLastRow = numberOfElementsLastRow + 1;
    }
    return data;
  };

  const Item = ({item, onPress, borderColor, borderWidth, borderStyle}) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '30%',
        marginRight: '1.6%',
        marginLeft: '1.6%',
        marginBottom: '3%',
      }}>
      <LinearGradient
        colors={[item.startCode, item.endCode]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          height: 80,
          borderRadius: 6,
          borderColor: borderColor,
          borderWidth: borderWidth,
          borderStyle: borderStyle,
        }}
      />
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    if (item.empty === true) {
      return <ColorTransParent></ColorTransParent>;
    }
    const borderColor = item === selectedColor ? 'red' : 'black';
    const borderWidth = item === selectedColor ? 3 : 0;
    const borderStyle = item === selectedColor ? 'dotted' : 'solid';

    return (
      <Item
        item={item}
        onPress={() => setSelectedColor(item)}
        borderColor={borderColor}
        borderWidth={borderWidth}
        borderStyle={borderStyle}
      />
    );
  };

  useEffect(() => {
    getData();
  }, [loading]);

  useEffect(() => {
    console.log('DATA', registerResult.data);
    if (registerResult.data?.createDiary.invitationCode) {
      navigation.navigate('CompleteMemo', {
        invitationCode: registerResult.data.createDiary.invitationCode,
      });
    } else {
      console.log('Loading or Error', registerResult.data);
    }
  }, [registerResult]);

  return isLoading ? (
    <SpinnerContainer>
      <Spinner visible={isLoading} textContent={'표지 색상 불러오는 중...'} />
    </SpinnerContainer>
  ) : (
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
      <TitleTextContainer>표지 색상 선택을 해보세요</TitleTextContainer>
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
      <Container>
        <FlatList
          data={formedData(colors, numColumns)}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={numColumns}
          // extraData={selectedColor.id}
        />
      </Container>
    </KeyboardAvoidingScrollView>
  );
};

export default AddMemoColor;

/*
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
*/
