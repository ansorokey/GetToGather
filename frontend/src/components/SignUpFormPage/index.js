import './SignUpFormPage.css';

import { signin, signup } from '../../store/session';
import { Redirect } from 'react-router-dom';
import { useModalContext } from '../../Context/ModalContext';
import {useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';

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

        const response = await dispatch(signup(userInfo));
        if(response && response.errors){
            setErrors(response.errors);
            return;
        } else {
            await dispatch(signin({ credential: email, password}));
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
                        placeholder='   First Name'
                    />
                    {errors.firstName && <span className='err'>{errors.firstName}</span>}
                </div>

                <div className='signup-input-field'>
                    <input
                        id="last-name-input"
                        value={lastName}
                        type="text"
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder='   Last Name'
                    />
                    {errors.lastName && <span className='err'>{errors.lastName}</span>}
                </div>

                <div className='signup-input-field'>
                    <input
                        id="email-input"
                        value={email}
                        type="text"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='   Email...'
                    />
                    {errors.email && <span className='err'>{errors.email}</span>}
                </div>

                <div className='signup-input-field'>
                    <input
                        id="username-input"
                        value={username}
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='   Username...'
                    />
                    {errors.username && <span className='err'>{errors.username}</span>}
                </div>

                <div className='signup-input-field'>
                    <input
                        id="password-input"
                        value={password}
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='   Password...'
                    />
                    <span className='show-pass-btn' onClick={() => setShowPassword(!showPassword)}>👁️‍🗨️</span>
                    {errors.password && <span className='err'>{errors.password}</span>}
                </div>

                <div className='signup-input-field'>
                    <input
                        id="confirm-password-input"
                        value={confirmPassword}
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder='   Confirm Password...'
                    />
                    {errors.password && <span className='err'>{errors.password}</span>}
                </div>


                    <button className='submit-signup'
                            disabled={!(firstName && lastName && email && username.length >= 4 && password.length >= 6 && confirmPassword === password)}
                    >Sign Up</button>

            </form>
        </div>
    );
}

export default SignUpFormPage;
