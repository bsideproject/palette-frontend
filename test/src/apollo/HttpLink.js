import {HttpLink} from '@apollo/client/link/http';

export function createHttpLink() {
  return new HttpLink({
    uri: 'https://palette-api.co.kr/graphql',
    credentials: 'include',
  });
}
