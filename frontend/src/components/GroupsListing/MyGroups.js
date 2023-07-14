import GroupTile from "../GroupTile";

import { useModalContext } from "../../Context/ModalContext";
import { getMyGroupsThunk } from "../../store/groups";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function MyGroups() {
    const dispatch = useDispatch();
    const curUser = useSelector(state => state.session.user);

    const {openModal} = useModalContext();
    const [groupsArr, setGroupsArr] = useState([]);

    async function loadMyGroups() {
        if(curUser) {
            const response = await dispatch(getMyGroupsThunk(curUser?.id));
            if(Array.isArray(response)){
                setGroupsArr(response);
            }
        }
    }

    useEffect(() => {
        loadMyGroups();
    }, [curUser]);

    return (
        <div className="list-ctn">
            {groupsArr.map(g => <GroupTile key={g.id} group={g} curUser={curUser} openModal={openModal} myGroup={true}/> )}
        </div>
    );
}

export default MyGroups;
