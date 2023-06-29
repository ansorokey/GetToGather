import { useEffect, useState } from "react";
import { useModalContext } from "../../Context/ModalContext";

import LoginFormPage from "../LoginFormPage";
import SignUpFormPage from '../SignUpFormPage';
import GroupDetails from "../GroupDetails";
import CreateGroupForm from "../CreateGroupForm";

import './Modal.css';

function Modal() {

    const {modalType, setShowModal} = useModalContext();
    const [modal, setModal] = useState(null);

    useEffect(() => {
        switch(modalType) {
            case 'login':
                setModal(<LoginFormPage/>);
                break;
            case 'signup':
                setModal(<SignUpFormPage/>);
                break;
            case 'groupDetails':
                setModal(<GroupDetails/>);
            case 'createGroup':
                setModal(<CreateGroupForm/>);
        }
    },[modalType]);

    return (
        <div className='modal-background'>
            <div className='modal-content'>
                <div className="close-modal">
                        <i
                            onClick={() => setShowModal(false)}
                            className="fa-solid fa-x fa-2xl"
                        ></i>
                </div>
                {modal}
            </div>
        </div>
    );
}

export default Modal;
