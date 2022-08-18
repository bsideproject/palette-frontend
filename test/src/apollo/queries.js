import {gql} from '@apollo/client';

// Query
export const COLOR_CODE = gql`
  query ColorCode {
    color {
      id
      startCode
      endCode
      order
    }
  }
`;

export const REGISTER_MEMO = gql`
  mutation CreateDiary($title: String!, $colorId: String!) {
    createDiary(createDiaryInput: {title: $title, colorId: $colorId}) {
      invitationCode
    }
  }
`;
