import './LandingPage.css';

import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useModalContext } from '../../Context/ModalContext';

function LandingPage() {
    const curUser = useSelector(state => state.session.user);
    const {openModal} = useModalContext();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='landing-page-container'>

            <div id='section-1'>
                <div className='s1-header-text'>
                    <h1>Saving the world is always better with help</h1>
                    <p className="p-text">Fighting big bad monsters? Combining into a megazord? Hanging out and enjoying a slice of pizza? TeamUp can find you what you want to do and the rangers to do it with.</p>
                </div>
                <div className='s1-image'>
                    <img className='landing-img' src='https://morphinlegacy.com/wp-content/uploads/2023/01/Legendary-Rangers-Super-Megaforce.png'/>
                </div>
            </div>

            <div id='section-2'>
                <div className='s2-header-text'>
                    <h2>How TeamUp Works</h2>
                    <p className="p-text">Become part of a crew and find something to do online or in-person. It's free to join!</p>
                </div>
            </div>

            <div id='section-3'>
                <div className='s3-tile'>
                    <img src='https://contxto.com/wp-content/uploads/2018/12/giphy.gif' />
                    <Link className="s3-link" to="/groups">
                        <h3 className='s3-tile-header-text'>
                        See all groups
                        </h3>
                    </Link>
                    {/* <h3 className='s3-tile-header-text'><Link to="/groups">See all groups</Link></h3> */}
                    <p className="p-text">Find your flock and soar</p>
                </div>
                <div className='s3-tile'>
                    <img src='https://thumbs.gfycat.com/DimDopeyCygnet-max-1mb.gif' />
                    <Link className="s3-link" to="/events"><h3 className='s3-tile-header-text'>Find an event</h3></Link>
                    <p className="p-text">Something is happening all the time. Be a part of it!</p>
                </div>
                <div className='s3-tile'>
                    <img src='https://media1.giphy.com/media/l0MYSPhERfzfCPnPy/giphy.gif' />
                    <h3
                        className={curUser ? 's3-tile-header-text' : 'disabled-landing-link'}
                        onClick={curUser ? () => openModal('createGroup') : null}
                    >Start a new Group</h3>
                    <p className="p-text">Lead your own pack into adventure</p>
                </div>
            </div>

            { !curUser && <div id='section-4'>
                <a href='#'>
                    <button
                        onClick={() => openModal('signup')}
                        className='s4-join-btn'
                    >
                        Join TeamUp
                    </button>
                </a>
            </div>}
        </div>

    );
}

export default LandingPage;
