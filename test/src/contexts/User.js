import React, {useState, createContext} from 'react';

const UserContext = createContext({
  user: {
    accessToken: null,
    email: null,
    socialTypes: null,
    nickname: null,
    profileImg: null,
    pushEnabled: null,
  },
  setUser: () => {},
});

const UserProvider = ({children}) => {
  const [user, setUserInfo] = useState({});
  const setUser = ({
    accessToken,
    email,
    socialTypes,
    nickname,
    profileImg,
    pushEnabled,
  }) => {
    setUserInfo({
      accessToken,
      email,
      socialTypes,
      nickname,
      profileImg,
      pushEnabled,
    });
  };

  const value = {user, setUser};
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export {UserContext, UserProvider};
