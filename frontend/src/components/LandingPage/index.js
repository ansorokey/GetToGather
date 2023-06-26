import hands from '../../images/hands-together.jpg'
import phImg1 from '../../images/placeholder1.png';
import phImg2 from '../../images/placeholder2.png';
import phImg3 from '../../images/placeholder3.png';
import './LandingPage.css';

function LandingPage() {
    return (
        <div className='landing-page-container'>

            <div id='section-1'>
                <div className='s1-header-text'>
                    <h1>Coming together for a common goal.</h1>
                    <p className="p-text">Fighting crime? Going on an adventure? A quest to save the world? Do what you love with people who love what <em>you</em> love.</p>
                </div>
                <div className='s1-image'>
                    <img className='landing-img' src={hands}/>
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
                    <h3 className='s3-tile-header-text'>See all groups</h3>
                    <p className="p-text">Lorem Ipsum</p>
                </div>
                <div className='s3-tile'>
                    <img src={phImg2} />
                    <h3 className='s3-tile-header-text'>Find an event</h3>
                    <p className="p-text">Lorem Ipsum</p>
                </div>
                <div className='s3-tile'>
                    <img src={phImg3} />
                    <h3 className='s3-tile-header-text'>Start a new Group</h3>
                    <p className="p-text">Lorem Ipsum</p>
                </div>
            </div>

            <div id='section-4'>
                <button>Join GetToGather</button>
            </div>
        </div>

    );
}

export default LandingPage;
