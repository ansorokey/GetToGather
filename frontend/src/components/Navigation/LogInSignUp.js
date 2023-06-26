import { useModalContext } from "../../Context/ModalContext";
import './index.css';

function LogInSignUp() {
    const {setModalType, openModal} = useModalContext();
    return (
        <div className="session-buttons-container">
            <button
                onClick={() => openModal('login')}
                className='session-button sb1'
            >Log in</button>

            <button
                onClick={() => openModal('signup')}
                className='session-button sb2'
            >Sign up</button>
        </div>
    );
}

export default LogInSignUp;
