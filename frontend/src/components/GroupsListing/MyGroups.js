import GroupTile from "../GroupTile";

import { useModalContext } from "../../Context/ModalContext";
import { getMyGroupsThunk } from "../../store/groups";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

function MyGroups() {
    const dispatch = useDispatch();
    const curUser = useSelector(state => state.session.user);

    const {openModal} = useModalContext();
    const [groupsArr, setGroupsArr] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadMyGroups() {
        if(curUser) {
            const response = await dispatch(getMyGroupsThunk(curUser?.id));
            if(Array.isArray(response)){
                setGroupsArr(response);
            }
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMyGroups();
    }, [curUser]);

    if(loading) {
        return <LoadingSpinner/>;
    } else {
        if(!curUser) return <Redirect to='/'/>;
        return (
            <div className="list-ctn">
                <h1>Your Groups</h1>
                {!groupsArr.length && <h2>You have not joined or organized any groups</h2>}
                {groupsArr.map(g => <GroupTile key={g.id} group={g} curUser={curUser} openModal={openModal} myGroup={true}/> )}
            </div>
        );
    }

}


export default MyGroups;
