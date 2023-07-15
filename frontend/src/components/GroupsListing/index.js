import './styles.css';

import MyGroups from './MyGroups';
import Listings from '../Listings';
import GroupTile from '../GroupTile';
import GroupDetails from '../GroupDetails';

import { useEffect } from 'react';
import { loadGroupsThunk } from '../../store/groups';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useParams } from 'react-router-dom';

function GroupsListing() {
    const dispatch = useDispatch();
    const groupState = useSelector(state => state.groups);
    const groupsArr = Object.values(groupState);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        dispatch(loadGroupsThunk());
    },[dispatch]);

    return (
        <>
            <Switch>
                <Route exact path='/groups'>
                    <div className='list-ctn'>
                        <Listings/>
                        <h2>Groups in TeamUp</h2>
                        {groupsArr.map(g => {
                            return (<GroupTile key={g.id} group={g}/>);
                        })}
                    </div>
                </Route>

            <Route exact path="/groups/current">
                <MyGroups/>
            </Route>

                <Route path="/groups/:groupId">
                    <GroupDetails />
                </Route>
            </Switch>
        </>
    );
}

export default GroupsListing;
