import './CreateGroupForm.css';
import {useEffect, useState} from 'react';
import { createGroupThunk, getGroupDetails, updateGroupThunk } from '../../store/groups';
import { useDispatch } from 'react-redux';
import { useModalContext } from '../../Context/ModalContext';
import {useHistory} from 'react-router-dom';

function CreateGroupForm({options}) {
    const [ validations, setValidations ] = useState({});
    const [ city, setCity ] = useState('');
    const [ state, setState ] = useState('');
    const [ name, setName ] = useState('');
    const [ about, setAbout ] = useState('');
    const [ meetType, setMeetType ] = useState('');
    const [ isPrivate, setIsPrivate ] = useState('default');
    const [ imgUrl, setImgUrl ] = useState('');

    const dispatch = useDispatch();
    const { closeModal } = useModalContext();
    const history = useHistory();

    useEffect(() => {
        if(options?.type === 'update'){
            const {group} = options;
            setCity(group.city);
            setState(group.state);
            setName(group.name);
            setAbout(group.about);
            setMeetType(group.type);
            setIsPrivate(group.private);
            setImgUrl(group.previewImage);
        }
    }, [options])

    function removeErr(key){
        setValidations(prevValue => {
            const newVal = {...prevValue};
            newVal[key] = undefined;
            return newVal;
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const err = {};
        if(!city) err.city = 'City is required';
        if(!state) err.state = 'State is required';
        if(!name) err.name = 'Group name is required';
        if(about.length < 50) err.about = 'Description must be at least 50 charactrs long';
        if(!meetType) err.meetType = 'Group type is required';
        if(isPrivate === 'default') err.isPrivate = 'Group privacy is required';
        if(!imgUrl || (!imgUrl.endsWith('.png') && !imgUrl.endsWith('.jpg') && !imgUrl.endsWith('.jpeg'))) err.imgUrl = 'Image Url must end in .png, .jpg, or .jpeg';

        setValidations(err);

        if(Object.values(err).length) return;

        const payload = {
            city,
            state,
            name,
            about,
            type: meetType,
            private: isPrivate,
            imgUrl
        };

        let response;
        if(options.type === 'create') {
            response = await dispatch(createGroupThunk(payload));
        } else {
            console.log('payload', payload);
            console.log('groupId', options.group.id);
            response = await dispatch(updateGroupThunk(payload, options.group.id));
            console.log('response', response);
        }

        if(response && response.errors){
            setValidations(response.errors);
        } else {
            dispatch(getGroupDetails(response.id));
            closeModal();
            history.push(`/groups/${response.id}`);
        }

    }

    return (
        <div className='create-group-ctn'>
            <form className='form' onSubmit={handleSubmit}>
                <div className='sec'>
                    {options.type === 'update' ?
                        <>
                            <h3>update</h3>
                            <h2>We'll walk you throught a few steps to update your group</h2>
                        </>
                        :
                        <>
                            <h3>Become an Organizer</h3>
                            <h2>We'll walk you throught a few steps to build your local community</h2>
                        </>
                        }
                </div>

                <hr className='line-break'/>

                <div className='sec'>
                    <h2>First, set your group's location</h2>
                    <p>GetToGather groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
                    <input
                        className='input'
                        type='text'
                        placeholder='City'
                        value={city}
                        onChange={(e) => { removeErr('city'); setCity(e.target.value)}}
                    />
                    {validations.city && <div className='err'>{validations.city}</div>}
                    <input type='text'
                        className='input'
                        placeholder='State'
                        value={state}
                        onChange={(e) => {removeErr('state'); setState(e.target.value)}}
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
                        onChange={(e) => {removeErr('name'); setName(e.target.value)}}
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
                        placeholder='Please enter at least 50 characters'
                        maxLength='256'
                        value={about}
                        onChange={(e) => {removeErr('about'); setAbout(e.target.value)}}
                        rows="10"
                    />
                    {validations.about && <div className='err'>{validations.about}</div>}
                </div>

                <hr className='line-break'/>

                <div className='sec'>
                    <h2>Final Steps...</h2>
                    <div className='select'>
                        <span>Is this an in-person or online group?</span>
                        <select value={meetType} onChange={(e) => {removeErr('meetType'); setMeetType(e.target.value)}}>
                            <option value=''>(select one)</option>
                            <option value='Online'>Online</option>
                            <option value='In person'>In person</option>
                        </select>
                        {validations.meetType && <div className='err'>{validations.meetType}</div>}
                    </div>

                    <div className='select'>
                        <span>Is this group private or public?</span>
                        <select value={isPrivate} onChange={(e) => {removeErr('isPrivate'); setIsPrivate(e.target.value)}}>
                            <option value='default'>(select one)</option>
                            <option value={true}>Private</option>
                            <option value={false}>Public</option>
                        </select>
                        {validations.isPrivate && <div className='err'>{validations.isPrivate}</div>}
                    </div>

                    <div>
                        <span>Please add an image url for your group below:</span>
                        <input
                            className='input'
                            type='text'
                            placeholder='Image Url'
                            value={imgUrl}
                            onChange={(e) => {removeErr('imgUrl'); setImgUrl(e.target.value)}}
                        />
                        {validations.imgUrl && <div className='err'>{validations.imgUrl}</div>}
                    </div>
                </div>

                <hr className='line-break'/>

                <button>{ options.type === 'create' ? 'Create Group' : 'Update Group'}</button>
            </form>
        </div>
    );
}

export default CreateGroupForm;
