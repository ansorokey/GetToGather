import './DeleteGroup.css';

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch } from 'react-redux';
import { useModalContext } from '../../Context/ModalContext';
import { deleteGroupThunk } from '../../store/groups';
import { deleteEventsThunk } from '../../store/events';

function DeleteGroup({group}) {
    const history = useHistory();
    const dispatch = useDispatch();

    const {closeModal} = useModalContext();

    async function handleDelete() {
        await dispatch(deleteGroupThunk(group));
        await dispatch(deleteEventsThunk(group));
        history.push('/groups');
        closeModal();
    }

    return (
        <div className='del-group-ctn'>
                <div>Confirm Delete</div>
                <div>Are you sure you want to delete this group?</div>
                <div className='del-g-name'>{group.name}</div>
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

export default DeleteGroup;
