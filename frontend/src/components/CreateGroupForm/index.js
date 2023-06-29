import './CreateGroupForm.css';
import {useState} from 'react';
import { createGroupThunk, getGroupDetails } from '../../store/groups';
import { useDispatch } from 'react-redux';
import { useModalContext } from '../../Context/ModalContext';
import {useHistory} from 'react-router-dom';

function CreateGroupForm() {
    const [ validations, setValidations ] = useState({});
    const [ city, setCity ] = useState('');
    const [ state, setState ] = useState('');
    const [ name, setName ] = useState('');
    const [ about, setAbout ] = useState('');
    const [ meetType, setMeetType ] = useState('');
    const [ isPrivate, setIsPrivate ] = useState('');
    const [ imgUrl, setImgUrl ] = useState('');

    const dispatch = useDispatch();
    const { closeModal } = useModalContext();
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            city,
            state,
            name,
            about,
            type: meetType,
            private: isPrivate,
            imgUrl
        };

        const response = await dispatch(createGroupThunk(payload));
        if(response && response.errors){
            console.log(response.errors);
            setValidations(response.errors);
        } else {
            dispatch(getGroupDetails(response.id));
            console.log('success', response)
            closeModal();
            history.push(`/groups/${response.id}`);
        }

    }

    return (
        <div className='create-group-ctn'>
            <form className='form' onSubmit={handleSubmit}>
                <div className='sec'>
                    <h3>Become an Organizer</h3>
                    <h2>We'll walk you throught a few steps to build your local community</h2>
                </div>

                <hr className='line-break'/>

                <div className='sec'>
                    <h2>First, set your group's location</h2>
                    <p>GetToGather groups meet locally, in personm and online. We'll connec tyou with people in your area, and more can join you online.</p>
                    <input
                        className='input'
                        type='text'
                        placeholder='City'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    {validations.city && <div className='err'>{validations.city}</div>}
                    <input type='text'
                        className='input'
                        placeholder='State'
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    />
                    {validations.state && <div className='err'>{validations.state}</div>}
                </div>

                <hr className='line-break'/>

                <div className='sec'>
                    <h2>What will your group's name be?</h2>
                    <p>Choose a name that will give people a clear idea of what the group is about.
Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                        className='input'
                        type='text'
                        placeholder="What is your group's name?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        />
                        {validations.name && <div className='err'>{validations.name}</div>}
                </div>

                <hr className='line-break'/>

                <div className='sec'>
                    <h2>Now describe what your group wil be about</h2>
                    <p>People will see this when we promote your group, but you'll be able to add to it later, too.</p>

                    <div>
                        <div>1 What's the purpose of the group?</div>
                        <div>2. Who should join?</div>
                        <div>3. What will you do at your events?</div>
                    </div>

                    <textarea
                        className='textarea'
                        placeholder='Please enter at least 30 characters'
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        rows="10"
                    />
                    {validations.about && <div className='err'>{validations.about}</div>}
                </div>

                <hr className='line-break'/>

                <div className='sec'>
                    <h2>Final Steps...</h2>
                    <div className='select'>
                        <span>Is this an in-person or online group?</span>
                        <select value={meetType} onChange={(e) => setMeetType(e.target.value)}>
                            <option value=''>(select one)</option>
                            <option value='Online'>Online</option>
                            <option value='In person'>In person</option>
                        </select>
                    </div>

                    <div className='select'>
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
                            className='input'
                            type='text'
                            placeholder='Image Url'
                            value={imgUrl}
                            onChange={(e) => setImgUrl(e.target.value)}
                        />
                    </div>
                </div>

                <hr className='line-break'/>

                <button>Create Group</button>
            </form>
        </div>
    );
}

export default CreateGroupForm;
