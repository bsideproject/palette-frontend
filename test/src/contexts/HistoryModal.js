import React, {useState, createContext} from 'react';

const HistoryModalContext = createContext({
  modalVisible: false,
  setHistoryModalVisible: () => {},
});

const HistoryModalProvider = ({children}) => {
  const [modalVisible, setModalVisible] = useState({});
  const setHistoryModalVisible = isVisible => {
    setModalVisible(isVisible);
  };
  const value = {modalVisible, setHistoryModalVisible};
  return (
    <HistoryModalContext.Provider value={value}>
      {children}
    </HistoryModalContext.Provider>
  );
};

export {HistoryModalContext, HistoryModalProvider};
