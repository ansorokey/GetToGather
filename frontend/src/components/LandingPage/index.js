import landingImg from '../../images/landing-page.png';
import phImg1 from '../../images/placeholder1.png';
import phImg2 from '../../images/placeholder2.png';
import phImg3 from '../../images/placeholder3.png';
import './LandingPage.css';

import { Link } from 'react-router-dom';
import { useModalContext } from '../../Context/ModalContext';
import { useSelector } from 'react-redux';

function LandingPage() {
    const curUser = useSelector(state => state.session.user);
    const {openModal} = useModalContext();
    return (
        <div className='landing-page-container'>

            <div id='section-1'>
                <div className='s1-header-text'>
                    <h1>Coming together for a common goal.</h1>
                    <p className="p-text">Fighting crime? Going on an adventure? A quest to save the world? Do what you love with people who love what <em>you</em> love.</p>
                </div>
                <div className='s1-image'>
                    <img className='landing-img' src={landingImg}/>
                </div>
            </div>

            <div id='section-2'>
                <div className='s2-header-text'>
                    <h2>How GetToGather Works</h2>
                    <p className="p-text">Become part of a crew and find something to do online or in-person. It's free to join!</p>
                </div>
            </div>

            <div id='section-3'>
                <div className='s3-tile'>
                    <img src={phImg1} />
                    <Link className="s3-link" to="/groups">
                        <h3 className='s3-tile-header-text'>
                        See all groups
                        </h3>
                    </Link>
                    {/* <h3 className='s3-tile-header-text'><Link to="/groups">See all groups</Link></h3> */}
                    <p className="p-text">Lorem Ipsum</p>
                </div>
                <div className='s3-tile'>
                    <img src={phImg2} />
                    <Link className="s3-link" to="/events"><h3 className='s3-tile-header-text'>Find an event</h3></Link>
                    <p className="p-text">Lorem Ipsum</p>
                </div>
                <div className='s3-tile'>
                    <img src={phImg3} />
                    <h3
                        className='s3-tile-header-text'
                        onClick={() => openModal('createGroup')}
                    >Start a new Group</h3>
                    <p className="p-text">Lorem Ipsum</p>
                </div>
            </div>

            { !curUser && <div id='section-4'>
                <a href='#'>
                    <button
                        onClick={() => openModal('signup')}
                        className='s4-join-btn'
                    >
                        Join GetToGather
                    </button>
                </a>
            </div>}
        </div>

    );
}

export default LandingPage;
