import Listings from '../Listings';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadGroupsThunk } from '../../store/groups';
import GroupTile from '../GroupTile';
import './styles.css';
import { Route } from 'react-router-dom';

function GroupsListing() {

    const dispatch = useDispatch();
    const groupState = useSelector(state => state.groups);
    const groupsArr = Object.values(groupState);

    useEffect(() => {
        dispatch(loadGroupsThunk());
    },[dispatch]);

    return (
        <>
            <div className='list-ctn'>
                <Listings/>
                {groupsArr.map(g => {
                    return (<GroupTile key={g.id} group={g}/>);
                })}
            </div>

            <Route path="/groups/:groupId">

            </Route>
        </>
    );
}

export default GroupsListing;
