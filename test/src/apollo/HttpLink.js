import {HttpLink} from '@apollo/client/link/http';

export function createHttpLink() {
  return new HttpLink({
    uri: 'http://61.97.190.252:8082/graphql',
  });
}
