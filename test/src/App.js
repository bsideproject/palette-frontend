import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {theme} from './theme';
import Navigation from './navigations';
import {UserProvider, ProgressProvider} from './contexts';
import {ApolloProvider} from '@apollo/client';
import {createApolloClient} from './apollo/ApolloClient';

const apolloClient = createApolloClient();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <UserProvider>
          <StatusBar
            backgroundColor={theme.background}
            barStyle="dark-content"
          />
          <Navigation />
        </UserProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
};

export default App;
