import React, {useContext, useEffect} from 'react';
import {ThemeContext} from 'styled-components/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity} from 'react-native';
import {
  MemoMain,
  AddMemo,
  AddMemoColor,
  AddInviteCode,
  CompleteMemo,
  CompleteInviteCode,
  SetMemoPeriod,
  History,
  EditDiaryColor,
  EditDiaryTitle,
  WriteDiary,
  ShowDiary,
  FirstExplain,
  SecondExplain,
  Nickname,
  ProfileImageSet,
  UserInfo,
  PushHistory,
} from '@screens';
import Home from './Home';
import {LogBox} from 'react-native';
import {HistoryModalContext} from '@contexts';
import WebView from 'react-native-webview';

const Stack = createStackNavigator();

const Main = () => {
  const theme = useContext(ThemeContext);
  const {setHistoryModalVisible} = useContext(HistoryModalContext);

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }, []);

  const Introduce = () => {
    return (
      <WebView
        source={{
          uri: 'https://bitter-humerus-381.notion.site/e61db202f6374facb437b45e4d73736e',
        }}
      />
    );
  };

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: theme.tintcolor,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: theme.fullWhite,
          borderBottomWidth: 1,
          borderBottomColor: theme.light010,
          height: 60,
        },
        title: '일기장 만들기',
        headerTitleStyle: {
          color: theme.dark010,
          fontSize: 16,
          fontWeight: '700',
          fontFamily: theme.fontRegular,
        },
        cardStyle: {backgroundColor: theme.fullWhite},
      }}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen name="MemoMain" component={MemoMain} />
      <Stack.Screen
        name="SetMemoPeriod"
        component={SetMemoPeriod}
        options={{
          title: '교환일기 설정하기',
        }}
      />
      <Stack.Screen
        name="History"
        component={History}
        options={{
          title: '히스토리',
          headerRight: () => (
            <TouchableOpacity onPress={() => setHistoryModalVisible(true)}>
              <Icon
                name={'ellipsis-vertical-sharp'}
                size={18}
                color={'black'}
                style={{marginRight: 20}}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="AddMemo" component={AddMemo} />
      <Stack.Screen name="AddMemoColor" component={AddMemoColor} />
      <Stack.Screen
        name="CompleteMemo"
        component={CompleteMemo}
        options={{
          headerLeft: false,
        }}
      />
      <Stack.Screen
        name="PushHistory"
        component={PushHistory}
        options={{
          title: '알림',
        }}
      />
      <Stack.Screen
        name="AddInviteCode"
        component={AddInviteCode}
        options={{
          title: '초대코드 입력',
        }}
      />
      <Stack.Screen
        name="CompleteInviteCode"
        component={CompleteInviteCode}
        options={{
          headerLeft: false,
          title: '초대코드 입력',
        }}
      />
      <Stack.Screen
        name="EditDiaryColor"
        component={EditDiaryColor}
        options={{
          title: '일기장 편집',
        }}
      />
      <Stack.Screen
        name="EditDiaryTitle"
        component={EditDiaryTitle}
        options={{
          title: '일기장 편집',
        }}
      />
      <Stack.Screen
        name="WriteDiary"
        component={WriteDiary}
        options={{
          title: '오늘의 일기',
        }}
      />
      <Stack.Screen
        name="ShowDiary"
        component={ShowDiary}
        options={{
          title: '오늘의 일기',
        }}
      />
      <Stack.Screen
        name="FirstExplain"
        component={FirstExplain}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SecondExplain"
        component={SecondExplain}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserInfo"
        component={UserInfo}
        options={{
          title: '계정',
        }}
      />
      <Stack.Screen
        name="Introduce"
        component={Introduce}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Nickname2"
        component={Nickname}
        options={{
          title: '닉네임 설정',
        }}
      />
      <Stack.Screen
        name="ProfileImageSet2"
        component={ProfileImageSet}
        options={{
          title: '프로필 사진 설정',
        }}
      />
    </Stack.Navigator>
  );
};

export default Main;
