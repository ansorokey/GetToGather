import { useEffect, useState } from "react";
import GroupTile from "../GroupTile";
import { useDispatch, useSelector } from "react-redux";
import { getMyGroupsThunk } from "../../store/groups";
import { useModalContext } from "../../Context/ModalContext";

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

    return <div className="list-ctn">
        {groupsArr.map(g => { return (
            <>
                <GroupTile key={g.id} group={g} buttons={true} />
                <div className="group-manage-btns">
                    { +g.organizerId === +curUser.id ?
                        <>
                            <button onClick={() => openModal('updateGroup', {type: 'update', group: g})}>Update</button>
                            <button onClick={() => openModal('deleteGroup', g)}>Delete</button>
                        </>
                        :
                        <button onClick={() => alert('feature coming soon~')}>Leave Group</button>
                    }
                </div>
            </>
        )})}
    </div>;
}

export default MyGroups;
