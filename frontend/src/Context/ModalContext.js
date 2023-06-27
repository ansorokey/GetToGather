import { createContext, useContext, useState } from 'react';

export const ModalContext = createContext();
export const useModalContext = () => useContext(ModalContext);

function ModalProvider({ children }) {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('null');

    function openModal(type){
        setModalType(type);
        setShowModal(true);
    }

  return (
    <ModalContext.Provider
      value={{
        showModal,
        setShowModal,
        modalType,
        setModalType,
        openModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default ModalProvider;
