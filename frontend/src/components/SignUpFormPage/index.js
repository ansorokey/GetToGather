import './SignUpFormPage.css';

import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { signup } from '../../store/session';
import { useModalContext } from '../../Context/ModalContext';
import { signin } from '../../store/session';

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

    const { closeModal } = useModalContext();
    const location = useLocation();

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
        const response = await dispatch(signup(userInfo));
        if(response && response.errors){
            setErrors(response.errors);
            return;
        } else {
            await dispatch(signin({email, password}));
            reset();
            closeModal();
        }
    }

    useEffect(() => {
        setErrors({});
    }, [password, confirmPassword, username, email]);

    if(curUser) return <Redirect to="/"/>;

    return (
        <div className='signup-ctn'>
            <h1>Sign Up</h1>
            <form className='signup-form' onSubmit={handleSubmit}>
                <div className='signup-input-field'>
                    <input
                        id="first-name-input"
                        value={firstName}
                        type="text"
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder='   First Name'
                    />
                    {errors.firstName && <span>{errors.firstName}</span>}
                </div>

                <div className='signup-input-field'>
                    <input
                        id="last-name-input"
                        value={lastName}
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder='   Last Name'
                    />
                    {errors.lastName && <span>{errors.lastName}</span>}
                </div>

                <div className='signup-input-field'>
                    <input
                        id="email-input"
                        value={email}
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='   Email...'
                    />
                    {errors.email && <span>{errors.email}</span>}
                </div>

                <div className='signup-input-field'>
                    <input
                        id="username-input"
                        value={username}
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder='   Username...'
                    />
                    {errors.username && <span>{errors.username}</span>}
                </div>

                <div className='signup-input-field'>
                    <input
                        id="password-input"
                        value={password}
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='   Password...'
                    />
                    <span className='show-pass-btn' onClick={() => setShowPassword(!showPassword)}>👁️‍🗨️</span>
                    {errors.password && <span>{errors.password}</span>}
                </div>

                <div className='signup-input-field'>
                    <input
                        id="confirm-password-input"
                        value={confirmPassword}
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder='   Confirm Password...'
                    />
                    {errors.password && <span>{errors.password}</span>}
                </div>


                    <button className='submit-signup'>Sign Up</button>

            </form>
        </div>
    );
}

export default SignUpFormPage;
