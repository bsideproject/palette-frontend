import moment from 'moment';

export const validateEmail = email => {
  const regex =
    /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[0-9?A-z]+\.[A-z]{2}.?[A-z]{0,3}$/;
  return regex.test(email);
};

export const removeWhiteSpace = text => {
  const regex = /\s/g;
  return text.replace(regex, '');
};

export const utcToKst = (value, format) => {
  const utcDateValue = moment(value, format).valueOf();
  const localDateValue = utcDateValue + 9 * 60 * 60 * 1000;

  return moment(localDateValue).format(format);
};
