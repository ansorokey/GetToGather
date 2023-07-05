import { useEffect, useState } from "react";
import { useModalContext } from "../../Context/ModalContext";

import LoginFormPage from "../LoginFormPage";
import SignUpFormPage from '../SignUpFormPage';
import GroupDetails from "../GroupDetails";
import CreateGroupForm from "../CreateGroupForm";
import DeleteGroup from "../DeleteGroup";
import DeleteEvent from "../DeleteEvent";

import './Modal.css';
import CreateEventForm from "../CreateEventForm";

function Modal() {

    const {modalType, closeModal, modalOptions} = useModalContext();
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
                break;
            case 'createGroup':
                setModal(<CreateGroupForm options={{type: 'create'}}/>);
                break;
            case 'updateGroup':
                setModal(<CreateGroupForm options={modalOptions}/>);
                break;
            case 'deleteGroup':
                setModal(<DeleteGroup group={modalOptions}/>);
                break;
            case 'createEvent':
                setModal(<CreateEventForm group={modalOptions}/>);
                break;
            case 'updateEvent':
                setModal(<CreateEventForm group={modalOptions.group} event={modalOptions.event} formType={modalOptions.type}/>);
                break;
            case 'deleteEvent':
                setModal(<DeleteEvent event={modalOptions}/>);
                break;
        }
    },[modalType]);

    return (
        <div className='modal-background'>
            <div className='modal-content'>
                <div className="close-modal">
                        <i
                            onClick={() => closeModal()}
                            className="fa-solid fa-x fa-2xl"
                        ></i>
                </div>
                {modal}
            </div>
        </div>
    );
}

export default Modal;
