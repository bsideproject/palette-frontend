import {gql} from '@apollo/client';

// Query
export const COLOR_CODE = gql`
  query ColorCode {
    color {
      hexCode
      order
    }
  }
`;

export const REGISTER_MEMO = gql`
  mutation CreateDiary($title: String!, $color: String!) {
    createDiary(createDiaryInput: {title: $title, color: $color}) {
      invitationCode
    }
  }
`;
