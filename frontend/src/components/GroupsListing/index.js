import Listings from '../Listings';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadGroupsThunk } from '../../store/groups';

function GroupsListing() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadGroupsThunk());
    },[dispatch]);

    return (
        <div>
            {/* <Listings/> */}
            <h1>These are groups</h1>
        </div>
    );
}

export default GroupsListing;
