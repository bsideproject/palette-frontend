import React, {useState, createContext} from 'react';

const UserContext = createContext({
  user: {accessToken: null, email: null, socialType: null, nickname: null},
  setUser: () => {},
});

const UserProvider = ({children}) => {
  const [user, setUserInfo] = useState({});
  const setUser = ({accessToken, email, socialType, nickname}) => {
    setUserInfo({accessToken, email, socialType, nickname});
  };
  const value = {user, setUser};
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export {UserContext, UserProvider};
