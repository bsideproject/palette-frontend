import React from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import {DB} from '../db_connect';

// Read Time & Date
const getDataorTime = ts => {
  const now = moment().startOf('day');
  const target = moment(ts).startOf('day');
  return moment(ts).format(now.diff(target, 'day') > 0 ? 'MM/DD' : 'HH:mm');
};

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
`;

const Sub = ({navigation}) => {
  return <Container />;
};

export default Sub;
