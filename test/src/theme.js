const Colors = {
  white: '#ffffff',
  black: '#111111',
  main: '#3679fe',
  grey_0: '#d5d5d5',
  grey_1: '#999999',
  red: '#FC2F2F',
  main_color: '#0F4CFC',
  tint_color: '#303030',
  memo_back_ground: '#F1F4FF',
  side_color: '#F3B949',
};

const Fonts = {
  regular: 'Pretendard-Regular',
  bold: 'Pretendard-Bold',
  light: 'Pretendard-Light',
};

export const theme = {
  background: Colors.white,
  memobackground: Colors.memo_back_ground,
  tintcolor: Colors.tint_color,
  text: Colors.black,
  errorText: Colors.red,

  mainColor: Colors.main_color,
  sideColor: Colors.side_color,

  // Image
  imgBackground: Colors.grey_0,

  // Input
  inputBackground: Colors.white,
  inputPlaceholder: Colors.grey_1,
  inputBorder: Colors.grey_1,
  inputDisabled: Colors.grey_0,

  // Btn Color
  btnTitle: Colors.white,
  btnMainColorBg: Colors.main_color,
  btnWhiteFont: Colors.white,
  btnWhiteColorBg: Colors.white,
  btnMainFont: Colors.main_color,

  // Font
  mainFont: Colors.main_color,
  grayFont: Colors.grey_1,
  whiteFont: Colors.white,

  // ErrorMessage
  inputValidChkColor: Colors.red,

  // Tab
  tabBtnActive: Colors.main_color,
  tabBtnInActive: Colors.grey_1,

  // Font
  fontRegular: Fonts.regular,
  fontBold: Fonts.bold,
  fontLight: Fonts.light,

  // Memo
  emptyMainBg: Colors.main_color,
};
