import {ApolloClient, ApolloLink} from '@apollo/client';
import {errorLink} from './ErrorLink';
import {createHttpLink} from './HttpLink';
import {localCache} from './LocalCache';

export function createApolloClient() {
  const httpLink = createHttpLink();

  const apolloClient = new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    connectToDevTools: process.env.NODE_ENV !== 'production',
    cache: localCache,
    assumeImmutableResults: true,
  });

  return apolloClient;
}
