import './SignUpFormPage.css';

import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { csrfFetch } from '../../store/csrf';
import { addUserThunk } from '../../store/session';

function SignUpFormPage() {
    const curUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function reset() {
        setConfirmPassword('');
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setUsername('');
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const userInfo = {
            firstName,
            lastName,
            username,
            email,
            password
        }

        dispatch(addUserThunk(userInfo));
        reset();
    }

    if(curUser) return <Redirect to="/"/>
    return (
        <div>
            <h1>Hello from sign up</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="first-name-input">First Name</label>
                    <input
                        id="first-name-input"
                        value={firstName}
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="last-name-input">Last Name</label>
                    <input
                        id="last-name-input"
                        value={lastName}
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="email-input">Email</label>
                    <input
                        id="email-input"
                        value={email}
                        type="text"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <label htmlFor="username-input">Username</label>
                <input
                    id="username-input"
                    value={username}
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <div>
                    <label htmlFor="password-input">Password</label>
                    <input
                        id="password-input"
                        value={password}
                        type="text"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="confirm-password-input">Confirm Password</label>
                    <input
                        id="confirm-password-input"
                        value={confirmPassword}
                        type="text"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div>
                    <button>Submit</button>
                </div>
            </form>
        </div>
    );
}

export default SignUpFormPage;
