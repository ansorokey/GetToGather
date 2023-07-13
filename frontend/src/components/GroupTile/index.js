import { Link } from "react-router-dom";
import './GroupTile.css';

function GroupTile({group, buttons = false}) {

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
                            <span>{group.numEvents} events</span>
                            <i class="fa-solid fa-circle fa-2xs"></i>
                            <span>{group.private === true ? 'Private' : 'Public'}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </>
    );
}

export default GroupTile;
