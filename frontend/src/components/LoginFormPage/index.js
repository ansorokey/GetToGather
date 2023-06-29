import { Redirect } from 'react-router-dom';
import { signin } from '../../store/session'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModalContext } from '../../Context/ModalContext';

import './LoginFormPage.css';

function LoginFormPage() {
    const curUser = useSelector(state => state.session.user);

    const [errMessage, setErrMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const dispatch = useDispatch();
    const {closeModal} = useModalContext();

    useEffect(() => {
        setSubmitted(false);
        setErrMessage('');
    }, [email, password]);

    function reset() {
        setEmail('');
        setPassword('');
    }

    async function onSubmit(e) {
        e.preventDefault();
        setSubmitted(true);

        const credentials = {email, password};
        const res = await dispatch(signin(credentials));
        // a successful login returns nothing
        if(res && res.errors){
            setErrMessage(res.errors.message);
        } else {
            closeModal();
            reset();
        }
    }

    //if there IS a user logged in, redirect to home
    if(curUser) return <Redirect to="/" />

    return (
        <div className='LogInMod'>
            <h2 className='text'>Log In</h2>
            { errMessage ? <p>{errMessage}</p> : null}
            <form className='login-form' onSubmit={onSubmit}>
                <div className='entry'>
                        <input
                            type="email"
                            placeholder="   Email..."
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {/* { submitted && !email ? <p>Email is required</p> : null} */}
                </div>

                <div className='entry'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="   Password..."
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* { submitted ? <p>Password is required</p> : null} */}
                        <span title="Show password" onClick={() => setShowPassword(!showPassword)}>👁️‍🗨️</span>
                </div>

                <div className="login-btns">
                    <button className="login-button">Login</button>
                    <button className="login-button">Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default LoginFormPage;
