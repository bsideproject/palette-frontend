const Colors = {
  white: '#ffffff',
  black: '#111111',
  main: '#3679fe',
  grey_0: '#d5d5d5',
  grey_1: '#999999',
  red: '#FC2F2F',
  icon_grey: '#D9D9D9',
  skip_color: '#8C8C8C',
  main_color: '#0F4CFC',
};

const Fonts = {
  regular: 'Pretendard-Regular',
  bold: 'Pretendard-Bold',
  light: 'Pretendard-Light',
};

export const theme = {
  background: Colors.white,
  text: Colors.black,
  errorText: Colors.red,

  // Buttons
  btnBackground: Colors.main,
  btnTitle: Colors.white,
  btnTextLink: Colors.main,
  btnSignout: Colors.red,

  // Image
  imgBackground: Colors.grey_0,
  imgBtnBackground: Colors.grey_1,
  imgBtnIcon: Colors.white,

  // Input
  inputBackground: Colors.white,
  inputLabel: Colors.grey_1,
  inputPlaceholder: Colors.grey_1,
  inputBorder: Colors.grey_1,
  inputDisabled: Colors.grey_0,

  // Spinner
  spinnerBackground: Colors.black,
  spinnerIndicator: Colors.white,

  // Tab
  tabBtnActive: Colors.main,
  tabBtnInActive: Colors.grey_1,

  // List - Item
  itemBorder: Colors.grey_0,
  itemTime: Colors.grey_1,
  itemDesc: Colors.grey_1,
  itemIcon: Colors.text,

  // Chat
  sendBtnActive: Colors.main,
  sendBtnInActive: Colors.grey_1,

  // Icon
  iconBackground: Colors.icon_grey,
  modalBackground: Colors.white,
  btnFooterText: Colors.white,

  btnMainColorBg: Colors.main_color,
  btnWhiteFont: Colors.white,
  btnWhiteColorBg: Colors.white,
  btnMainFont: Colors.main_color,

  inputValidChkColor: Colors.red,

  skipFontColor: Colors.skip_color,

  // font
  fontRegular: Fonts.regular,
  fontBold: Fonts.bold,
  fontLight: Fonts.light,
};
