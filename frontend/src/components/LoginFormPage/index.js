import { Redirect } from 'react-router-dom';
import { setUserThunk } from '../../store/session'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './LoginFormPage.css';

function LoginFormPage() {
    const curUser = useSelector(state => state.session.user);

    const [errMessage, setErrMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        setSubmitted(false);
    }, [email, password]);

    function reset() {
        setEmail('');
        setPassword('');
    }

    async function onSubmit(e) {
        e.preventDefault();
        setSubmitted(true);

        const credentials = {email, password};
        const res = await dispatch(setUserThunk(credentials));
        // a successful login returns nothing
        if(res && res.errors){
            setErrMessage(res.errors.message);
        }
        reset();
    }

    //if there IS a user logged in, redirect to home
    if(curUser) return <Redirect to="/" />

    return (
        <div className='LogInMod'>
            <h1 className='text'>Hello from Login {submitted}</h1>
            <h2 className='text'>Log In</h2>
            { errMessage ? <p>{errMessage}</p> : null}
            <form onSubmit={onSubmit}>
                <div className='entry'>
                        <input
                            type="email"
                            placeholder="Email..."
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {/* { submitted && !email ? <p>Email is required</p> : null} */}
                </div>

                <div className='entry'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password..."
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* { submitted ? <p>Password is required</p> : null} */}
                        <span onClick={() => setShowPassword(!showPassword)}>👁️‍🗨️</span>
                </div>

                <button className="login-button">Login</button>
                <button className="login-button">Sign Up</button>
            </form>
        </div>
    );
}

export default LoginFormPage;
