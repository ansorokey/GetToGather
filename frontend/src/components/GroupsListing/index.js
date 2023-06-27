import Listings from '../Listings';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadGroupsThunk } from '../../store/groups';
import GroupTile from '../GroupTile';

function GroupsListing() {

    const dispatch = useDispatch();
    const groupState = useSelector(state => state.groups);
    const groupsArr = Object.values(groupState);

    useEffect(() => {
        dispatch(loadGroupsThunk());
    },[dispatch]);

    return (
        <div>
            {/* <Listings/> */}
            <h1>These are groups</h1>
            {groupsArr.map(g => {
                return (<GroupTile key={g.id} group={g}/>);
            })}
        </div>
    );
}

export default GroupsListing;
