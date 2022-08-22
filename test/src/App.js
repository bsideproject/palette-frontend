import React from 'react';
import {StatusBar} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {ApolloProvider} from '@apollo/client';
import {createApolloClient} from '@apolloClient/ApolloClient';
import {theme} from './theme';
import Navigation from '@navigations';
import {UserProvider} from '@contexts';
import {HistoryModalProvider} from './contexts';

const apolloClient = createApolloClient();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <UserProvider>
          <HistoryModalProvider>
            <StatusBar
              backgroundColor={theme.background}
              barStyle="dark-content"
            />
            <Navigation />
          </HistoryModalProvider>
        </UserProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
};

export default App;
