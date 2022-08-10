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
