import './DeleteGroup.css';
import { useModalContext } from '../../Context/ModalContext';
import { useDispatch } from 'react-redux';
import {deleteGroupThunk} from '../../store/groups';
import {deleteEventsThunk} from '../../store/events';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

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
        <div>
                <div>Confirm Delete</div>
                <div>Are you sure you want to delete this group?{group.id}</div>
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
