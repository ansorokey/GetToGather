import './CreateGroupForm.css';
import {useState} from 'react';

function CreateGroupForm() {
    const [ , set ] = useState('');
    const [ city, setCity ] = useState('');
    const [ state, setState ] = useState('');
    const [ name, setName ] = useState('');
    const [ about, setAbout ] = useState('');
    const [ meetType, setMeetType ] = useState('');
    const [ isPrivate, setIsPrivate ] = useState('');
    const [ imgUrl, setImgUrl ] = useState('');

    function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            city,
            state,
            name,
            about,
            meetType,
            isPrivate,
            imgUrl
        };

        console.log(payload);
    }

    return (
        <div className='create-group-ctn'>
            <form className='form' onSubmit={handleSubmit}>
                <div className='sec'>
                    <h3>Become an Organizer</h3>
                    <h2>We'll walk you throught a few steps to build your local community</h2>
                </div>

                <div className='sec'>
                    <h2>First, set your group's location</h2>
                    <p>GetToGather groups meet locally, in personm and online. We'll connec tyou with people in your area, and more can join you online.</p>
                    <input
                        type='text'
                        placeholder='City'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <input type='text'
                        placeholder='State'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                </div>

                <div className='sec'>
                    <h2>What will your group's name be?</h2>
                    <p>Choose a name that will give people a clear idea of what the group is about.
Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                        type='text'
                        placeholder="What is your group's name?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                </div>

                <div className='sec'>
                    <h2>Now describe what your group wil be about</h2>
                    <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>

                    <div>
                        <div>1 W.hat's the purpose of the group?</div>
                        <div>2. Who should join?</div>
                        <div>3. What will you do at your events?</div>
                    </div>

                    <textarea
                        placeholder='Please enter at least 30 characters'
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                </div>

                <div className='sec'>
                    <h2>FInal Steps...</h2>
                    <div>
                        <span>Is this an in-person or online group?</span>
                        <select value={meetType} onChange={(e) => setMeetType(e.target.value)}>
                            <option value=''>(select one)</option>
                            <option value='Online'>Online</option>
                            <option value='In person'>In person</option>
                        </select>
                    </div>

                    <div>
                        <span>Is this group private or public?</span>
                        <select value={isPrivate} onChange={(e) => setIsPrivate(e.target.value)}>
                            <option value=''>(select one)</option>
                            <option value={true}>Private</option>
                            <option value={false}>Public</option>
                        </select>
                    </div>

                    <div>
                        <span>Please add an image url for your group below:</span>
                        <input
                            type='text'
                            placeholder='Image Url'
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                        />
                    </div>
                </div>

                <button>Create Group</button>
            </form>
        </div>
    );
}

export default CreateGroupForm;
