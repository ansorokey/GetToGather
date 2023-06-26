import { useEffect, useState } from "react";
import { useModalContext } from "../../Context/ModalContext";

import LoginFormPage from "../LoginFormPage";
import SignUpFormPage from '../SignUpFormPage';

import './Modal.css';

function Modal() {

    const {modalType, setShowModal} = useModalContext();
    const [modal, setModal] = useState(null);

    useEffect(() => {
        switch(modalType) {
            case 'login':
                setModal(<LoginFormPage/>);
                return;
            case 'signup':
                setModal(<SignUpFormPage/>);
        }
    },[modalType]);

    return (
        <div className='modal-background'>
            <div className="close-modal">
                    <i
                        onClick={() => setShowModal(false)}
                        class="fa-solid fa-x fa-2xl"
                    ></i>
            </div>
            {modal}
        </div>
    );
}

export default Modal;
