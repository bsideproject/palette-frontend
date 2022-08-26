import React, {useState, createContext} from 'react';

const UserContext = createContext({
  user: {accessToken: null, email: null, socialType: null, nickname: null, profileImg: null},
  setUser: () => {},
});

const UserProvider = ({children}) => {
  const [user, setUserInfo] = useState({});
  const setUser = ({accessToken, email, socialType, nickname, profileImg}) => {
    setUserInfo({accessToken, email, socialType, nickname, profileImg});
  };
  const value = {user, setUser};
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export {UserContext, UserProvider};
