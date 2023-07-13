import { useEffect, useState } from "react";
import GroupTile from "../GroupTile";
import { useDispatch, useSelector } from "react-redux";
import { getMyGroupsThunk } from "../../store/groups";
import { useModalContext } from "../../Context/ModalContext";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

function MyGroups() {
    const curUser = useSelector(state => state.session.user);
    const {openModal} = useModalContext();
    const dispatch = useDispatch();

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

    // if(curUser === null) return <Redirect to="/" />;

    return <div className="list-ctn">
        {groupsArr.map(g => { return (
                <GroupTile key={g.id} group={g} curUser={curUser} openModal={openModal} myGroup={true}/>
        )})}
    </div>;
}

export default MyGroups;
