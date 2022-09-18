import React, {useContext, useEffect, useState, useRef} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {Text, TouchableOpacity, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {FlatList} from 'react-native-gesture-handler';
import {USE_QUERY, USE_MUTATION} from '@apolloClient/queries';
import {UserContext} from '@contexts';
import {Button, ErrorMessage, ErrorAlert} from '@components';
import LinearGradient from 'react-native-linear-gradient';
import {LogBox} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Flow} from 'react-native-animated-spinkit';

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  background-color: ${({theme}) => theme.fullWhite};
  padding-right: 5%;
  padding-left: 5%;
  align-items: center;
  justify-content: space-between;
`;

const SpinnerContainer = styled.View`
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
  margin-bottom: 20%;
`;

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
  const {user} = useContext(UserContext);
  const {loading, error, data} = USE_QUERY('COLOR_CODE', user.accessToken);
  const [loadingMessage, setLoadingMessage] =
    useState('표지 색상 불러오는 중...');
  const [
    registerMemo,
    {loading: loadingRegister, error: errorRegister, data: dataRegister},
  ] = USE_MUTATION('REGISTER_MEMO', user.accessToken);
  // Disable FlatList Log
  LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

  // [QUERY EVENT FUNCTION] --------------------------------------
  const getData = () => {
    if (error != undefined) {
      console.log('ERROR: ', JSON.stringify(error));
      // [TODO] Go to Error Page
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loading || data == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      let readData = [];
      data['colors'].map(item => {
        readData.push({
          id: item.id,
          order: item.order,
          startCode: item.startCode,
          endCode: item.endCode,
        });
      });
      setColors(readData);
      // console.log(readData);
      setIsLoading(false);
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
      setIsLoading(true);
      setLoadingMessage('일기 생성 중...');
      registerMemo({
        variables: {
          title: receivedName,
          colorId: selectedColor.id,
        },
      });
    }
  };

  // [USE EFFECT] -----------------------------------------------
  useEffect(() => {
    getData();
  }, [loading]);

  useEffect(() => {
    if (errorRegister != undefined) {
      let jsonData = JSON.parse(JSON.stringify(errorRegister));
      console.log(jsonData);
      setIsLoading(false);
      ErrorAlert();
    } else {
      if (loadingRegister || dataRegister == undefined) {
        console.log('Data Fecting & Data Empty');
        return;
      }
      // If Success
      console.log('DATA', dataRegister);
      if (dataRegister?.createDiary.invitationCode) {
        setIsLoading(false);
        navigation.navigate('CompleteMemo', {
          invitationCode: dataRegister.createDiary.invitationCode,
        });
      } else {
        console.log('Loading or Error', dataRegister);
        setIsLoading(false);
        ErrorAlert();
      }
    }
  }, [loadingRegister]);

  // [RENDER FUNCTION] -----------------------------------------------
  const formedData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({
        id: `blank-${numberOfElementsLastRow}`,
        color: theme.dark010,
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
          flex: 1,
          height: 80,
          borderRadius: 6,
        }}>
        {item === selectedColor && (
          <View
            style={{
              flex: 1,
              borderRadius: 8,
              borderColor: borderColor,
              borderWidth: borderWidth,
              borderStyle: borderStyle,
            }}>
            <Icon
              name={'checkmark-circle'}
              size={20}
              color={theme.pointColor}
              style={{position: 'absolute', bottom: 5, left: 5}}
            />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => {
    if (item.empty === true) {
      return <ColorTransParent></ColorTransParent>;
    }
    const borderColor =
      item === selectedColor ? theme.pointColor : theme.dark010;
    const borderWidth = item === selectedColor ? 3 : 0;
    const borderStyle = 'solid';

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

  return isLoading ? (
    <SpinnerContainer>
      <Flow animating={isLoading} size={100} color={theme.pointColor} />
    </SpinnerContainer>
  ) : (
    <KeyboardAvoidingScrollView
      containerStyle={{
        backgroundColor: theme.fullWhite,
      }}
      stickyFooter={
        <BtnContainer>
          <Button
            title="다음 단계로"
            onPress={_handleSetCompleteMemo}
            containerStyle={{
              backgroundColor: theme.pointColor,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            textStyle={{
              color: theme.white,
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
            IconColor={theme.error}
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
