import './styles.css';
import { useState } from 'react';

function CreateEventForm ({group}) {
    const [valErrs, setValErrs] = useState({});
    const [name, setName] = useState('');
    const [type, setType] = useState('default');
    const [capacity, setCapacity] = useState(0);
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const errs = {};

        if(!name) errs.name = 'Name is required';
        if(type === 'default') errs.type = 'Event Type is required';
        if(!capacity) errs.capacity = 'Capacity must be greater than 0';
        if(price === undefined) errs.price = 'Price is required';
        if(!startDate) errs.startDate = 'Start date is required';
        if(!endDate) errs.endDate = 'End date is required';
        if(!(imgUrl.endsWith('.png') || imgUrl.endsWith('.jpg') || imgUrl.endsWith('.jpeg'))) errs.imgUrl = 'Image URL must end in .png, .jpg, or .jpeg';
        if(description.length < 30) errs.description = 'Description must be at least 30 characters long';

        if(Object.values(errs).length){
            setValErrs(errs);
        } return;

        const payload = {
            name,
            type,
            capacity,
            price,
            startDate,
            endDate,
            description,
            imgUrl
        }

        console.log(payload);
    }

    return (
        <div className='create-event-ctn'>

            <form onSubmit={handleSubmit}>
                <div className='sec'>
                    <div>Create an event for {group.name}</div>
                    <div>What is the name of your event?</div>
                    <input
                        type='text'
                        placeholder='  Event name...'
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                    />
                    {valErrs.name && <span className='.err'>{valErrs.name}</span>}
                </div>
                <hr/>
                <div className='sec'>
                    <div>Is this an in-person or online event?</div>
                    <select value={type}
                            onChange={e => setType(e.target.value)}
                            >
                        <option value='default'>(select one)</option>
                        <option value='Online'>Online</option>
                        <option value='In-person'>In-person</option>
                    </select>
                    {valErrs.type && <span className='.err'>{valErrs.type}</span>}

                    <div>How many people can join?</div>
                    <input
                        type='number'
                        value={capacity}
                        onChange={e => setCapacity(e.target.value)}
                    />
                    {valErrs.capacity && <span className='.err'>{valErrs.capacity}</span>}

                    <div>What is the price for your event?</div>
                    <input
                        type='number'
                        placeholder='   0'
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                    />
                    {valErrs.price && <span className='.err'>{valErrs.price}</span>}
                </div>
                <hr/>
                <div className='sec'>
                    <div>When does your event start?</div>
                    <input
                        type='datetime-local'
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                    {valErrs.startDate && <span className='.err'>{valErrs.startDate}</span>}

                    <div>When does your event end?</div>
                    <input
                        type='datetime-local'
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                    {valErrs.endDate && <span className='.err'>{valErrs.endDate}</span>}
                </div>
                <hr/>
                <div className='sec'>
                    <div>Please add an image url for your event below:</div>
                    <input
                        type='text'
                        placeholder='   Image URL...'
                        value={imgUrl}
                        onChange={e => setImgUrl(e.target.value)}
                    />
                    {valErrs.imgUrl && <span className='.err'>{valErrs.imgUrl}</span>}
                </div>
                <hr/>
                <div className='sec'>
                    <div>Please describe your event</div>
                    <textarea
                        placeholder='   Please include at least _ characters...'
                        rows='10'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    {valErrs.description && <span className='.err'>{valErrs.description}</span>}
                </div>
                <button>Create Event</button>
            </form>
        </div>
    );
}

export default CreateEventForm;
