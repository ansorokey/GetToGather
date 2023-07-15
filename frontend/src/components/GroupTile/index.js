import './GroupTile.css';

import { Link } from "react-router-dom";

function GroupTile({group, curUser, openModal, myGroup}) {

    return (
        <>
            <hr className="tile-split" />
            <Link className="tile-link" to={`/groups/${group.id}`} onClick={() => window.scrollTo(0, 0)}>
                <div className="tile-ctn">
                    <div className="tile-img-ctn">
                        <img className="tile-img" src={group.previewImage}/>
                    </div>
                    <div className="tile-info">
                        <h2>{group.name}</h2>
                        <h3>{group.city}, {group.state}</h3>
                        <p>{group.about}</p>
                        <div className='members-type'>
                            <span>{group?.Events?.length} events</span>
                            <i className="fa-solid fa-circle fa-2xs"></i>
                            <span>{group.private === true ? 'Private' : 'Public'}</span>
                        </div>
                    </div>
                </div>
            </Link>
            {myGroup && <div className="group-manage-btns">
                    { +group.organizerId === +curUser.id ?
                        <>
                            <button onClick={() => openModal('updateGroup', {type: 'update', group})}>Update</button>
                            <button onClick={() => openModal('deleteGroup', group)}>Delete</button>
                        </>
                        :
                        <button onClick={() => alert('feature coming soon~')}>Leave Group</button>
                    }
            </div>}
        </>
    );
}

export default GroupTile;
