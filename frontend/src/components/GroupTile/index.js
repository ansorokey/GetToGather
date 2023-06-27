import { Link } from "react-router-dom";
import './GroupTile.css';

function GroupTile({group}) {
    return (
        <Link className="tile-link" to={`/groups/${group.id}`}>
            <div className="tile-ctn">
                <div className="tile-img-ctn">
                    <img className="tile-img"/>
                </div>
                <div className="tile-info">
                    <h2>{group.name}</h2>
                    <h3>{group.city}, {group.state}</h3>
                    <p>{group.about}</p>
                    <div>
                        <h4>{group.type}</h4>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default GroupTile;
