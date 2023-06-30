import './styles.css';
//TO-DO import useState and create state values for each input
// attach handlesubmit to the form

function CreateEventForm ({group}) {

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <div className='create-event-ctn'>

            <form>
                <div className='sec'>
                    <div>Create an event for {group.name}</div>
                    <div>What is the name of your event?</div>
                    <input
                        type='text'
                        placeholder='  Event name...'
                        value='eventName'
                    />
                </div>
                <hr/>
                <div className='sec'>
                    <div>Is this an in-person or online event?</div>
                    <select>
                        <option value='default'>(select one)</option>
                        <option value='online'>Online</option>
                        <option value='in-person'>In-person</option>
                    </select>

                    <div>Is this event public or private?</div>
                    <select>
                        <option value='default'>(select one)</option>
                        <option value='private'>Private</option>
                        <option value='public'>Public</option>
                    </select>

                    <div>What is the price for your event?</div>
                    <input type='number'/>
                </div>
                <hr/>
                <div className='sec'>
                    <div>When does your event start?</div>
                    <input type='datetime-local'/>

                    <div>When does your event end?</div>
                    <input type='datetime-local'/>
                </div>
                <hr/>
                <div className='sec'>
                    <div>Please add an image url for your event below:</div>
                    <input
                        type='text'
                        placeholder='   Image URL...'
                    />
                </div>
                <hr/>
                <div className='sec'>
                    <div>Please describe your event</div>
                    <textarea
                        placeholder='   Please include at least _ characters...'
                        rows='10'
                    />
                </div>
                <button>Create Event</button>
            </form>
        </div>
    );
}

export default CreateEventForm;
