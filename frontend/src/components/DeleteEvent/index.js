import './DeleteEvent.css';

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch } from 'react-redux';
import { useModalContext } from '../../Context/ModalContext';
import { removeSingleEventThunk } from '../../store/events';

function DeleteEvent({event}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const { closeModal } = useModalContext();

    async function handleDelete() {
        await dispatch(removeSingleEventThunk(+event.id));
        history.push(`/groups/${event.groupId}`);
        closeModal();
    }

    return (
        <div className='del-group-ctn'>
                <div>Confirm Delete</div>
                <div>Are you sure you want to delete this event?</div>
                <div>{event.name}</div>
                <button
                    className='dlt-yes'
                    onClick={handleDelete}
                >Yes</button>

                <button
                    onClick={closeModal}
                    className='dlt-no'
                >No</button>
        </div>
    );
}

export default DeleteEvent;
