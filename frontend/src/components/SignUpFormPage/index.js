import './SignUpFormPage.css';

import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
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
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

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

        const valErrs = {};
        if(password !== confirmPassword) {
            valErrs.password = 'Passwords do not match';
            setErrors(valErrs);
            return;
        }

        const userInfo = {
            firstName,
            lastName,
            username,
            email,
            password
        }

        // if(Object.values(errors).length) return

        // only an error returns, does not need to be parsed
        const response = await dispatch(addUserThunk(userInfo));
        if(response && response.errors){
            setErrors(response.errors);
            return;
        }
        reset();
    }

    useEffect(() => {
        setErrors({});
    }, [password, confirmPassword, username, email]);

    if(curUser) return <Redirect to="/"/>;

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
                        required
                    />
                    {errors.firstName && <span>{errors.firstName}</span>}
                </div>

                <div>
                    <label htmlFor="last-name-input">Last Name</label>
                    <input
                        id="last-name-input"
                        value={lastName}
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    {errors.lastName && <span>{errors.lastName}</span>}
                </div>

                <div>
                    <label htmlFor="email-input">Email</label>
                    <input
                        id="email-input"
                        value={email}
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <span>{errors.email}</span>}
                </div>

                <div>
                    <label htmlFor="username-input">Username</label>
                    <input
                        id="username-input"
                        value={username}
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    {errors.username && <span>{errors.username}</span>}
                </div>

                <div>
                    <label htmlFor="password-input">Password</label>
                    <input
                        id="password-input"
                        value={password}
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <span onClick={() => setShowPassword(!showPassword)}>👁️‍🗨️</span>
                    {errors.password && <span>{errors.password}</span>}
                </div>

                <div>
                    <label htmlFor="confirm-password-input">Confirm Password</label>
                    <input
                        id="confirm-password-input"
                        value={confirmPassword}
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {errors.password && <span>{errors.password}</span>}
                </div>

                <div>
                    <button>Submit</button>
                </div>
            </form>
        </div>
    );
}

export default SignUpFormPage;
