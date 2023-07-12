import { createContext, useContext, useState } from 'react';

export const ModalContext = createContext();
export const useModalContext = () => useContext(ModalContext);

function ModalProvider({ children }) {
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('null');
    const [modalOptions, setModalOptions] = useState({});

    function openModal(type, options){
        setModalType(type);
        setShowModal(true);
        if(options) setModalOptions(options);
    }

    function closeModal(){
      setModalType(null);
      setShowModal(false);
      setModalOptions({});
    }

  return (
    <ModalContext.Provider
      value={{
        showModal,
        setShowModal,
        modalType,
        setModalType,
        openModal,
        closeModal,
        modalOptions
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export default ModalProvider;
