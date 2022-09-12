import {Alert} from 'react-native';

const ErrorAlert = () => {
  Alert.alert(
    '일시적인 오류가 발생했습니다.',
    '서비스 이용에 불편을 드려 죄송합니다.\n잠시 후 다시 이용해주세요',
    [{text: 'OK', onPress: () => console.log('OK Pressed')}],
  );
};

export default ErrorAlert;
