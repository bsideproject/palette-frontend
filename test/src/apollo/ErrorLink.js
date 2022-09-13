import {onError} from '@apollo/client/link/error';
import {_handleRefreshApi} from '../api/tokenAPI';
import {fromPromise, concat} from 'apollo-link';
import {getCookie} from '../api/Cookie';

export const errorLink = onError(
  ({graphQLErrors, networkError, response, operation, forward}) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        console.error(
          `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`,
          operation,
          response,
        );
      }
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`, operation, response);
      let jsonData = JSON.parse(JSON.stringify(networkError));
      if (jsonData.bodyText == 'invalid authorization header') {
        console.log('Auth Error');
        return fromPromise(
          _handleRefreshApi()
            .then(({accessToken, refreshToken}) => {
              // Get Refresh Token Save in Cookie
              console.log('Retry Query', getCookie('access_token'));
              const oldHeaders = operation.getContext().headers;
              console.log('OOOO', oldHeaders);
              operation.setContext({
                headers: {
                  authorization: 'Bearer ' + getCookie('access_token'),
                  'Content-Type': 'application/json',
                },
              });
              const newHeaders = operation.getContext().headers;
              console.log('NNNNN', newHeaders);
              return forward(operation);
            })
            .catch(error => {
              // Handle token refresh errors e.g clear stored tokens, redirect to login, ...
              return;
            }),
        )
          .filter(value => Boolean(value))
          .flatMap(() => {
            // retry the request, returning the new observable
            return forward(operation);
          });
      }
    }
  },
);
