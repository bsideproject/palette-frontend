import React, {useState, createContext} from 'react';

const UserContext = createContext({
  user: {accessToken: null, email: null, socialTypes: null, nickname: null, profileImg: null},
  setUser: () => {},
});

const UserProvider = ({children}) => {
  const [user, setUserInfo] = useState({});
  const setUser = ({accessToken, email, socialTypes, nickname, profileImg}) => {
    setUserInfo({accessToken, email, socialTypes, nickname, profileImg});
  };
  const value = {user, setUser};
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export {UserContext, UserProvider};
