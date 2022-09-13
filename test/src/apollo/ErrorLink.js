import {onError} from '@apollo/client/link/error';
import {_handleRefreshApi} from '../api/tokenAPI';
import {fromPromise, concat} from 'apollo-link';

export const errorLink = onError(
  ({graphQLErrors, networkError, response, operation}) => {
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
