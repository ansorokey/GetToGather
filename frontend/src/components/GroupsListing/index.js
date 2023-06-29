import Listings from '../Listings';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadGroupsThunk } from '../../store/groups';
import GroupTile from '../GroupTile';
import './styles.css';
import { Route, Switch } from 'react-router-dom';
import GroupDetails from '../GroupDetails';

function GroupsListing() {
    const dispatch = useDispatch();
    const groupState = useSelector(state => state.groups);
    const groupsArr = Object.values(groupState);

    useEffect(() => {
        dispatch(loadGroupsThunk());
    },[dispatch]);

    return (
        <>
        <Switch>
            <Route exact path='/groups'>
                <div className='list-ctn'>
                    <Listings/>
                    {groupsArr.map(g => {
                        return (<GroupTile key={g.id} group={g}/>);
                    })}
                </div>
            </Route>

            <Route path="/groups/:groupId">
                <GroupDetails />
            </Route>
        </Switch>

        </>
    );
}

export default GroupsListing;
