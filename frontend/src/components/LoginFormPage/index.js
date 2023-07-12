import { Redirect } from 'react-router-dom';
import { signin } from '../../store/session'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModalContext } from '../../Context/ModalContext';

import './LoginFormPage.css';

function LoginFormPage() {
    const curUser = useSelector(state => state.session.user);
    console.log(curUser);

    const [errMessage, setErrMessage] = useState('');
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const dispatch = useDispatch();
    const {closeModal} = useModalContext();

    useEffect(() => {
        setSubmitted(false);
        setErrMessage('');
    }, [credential, password]);

    function reset() {
        setCredential('');
        setPassword('');
    }

    async function onSubmit(e) {
        e.preventDefault();
        setSubmitted(true);

        const credentials = {credential, password};
        const res = await dispatch(signin(credentials));
        // a successful login returns nothing
        if(res && res.errors){
            setErrMessage(res.errors.message);
        } else {
            closeModal();
            reset();
        }
    }

    async function demoLogin() {
        await dispatch(signin({credential: 'demouser', password: 'password'}));
        closeModal();
        reset();

    }

    //if there IS a user logged in, redirect to home
    if(curUser) return <Redirect to="/" />;

    return (
        <div className='LogInMod'>
            <h2 className='cred'>Log In</h2>
            { errMessage ? <p>{errMessage}</p> : null}
            <form className='login-form' onSubmit={onSubmit}>
                <div className='entry'>
                        <input
                            type="text"
                            placeholder="   Email or Username..."
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                        />
                </div>

                <div className='entry'>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="   Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span title="Show password" onClick={() => setShowPassword(!showPassword)}>👁️‍🗨️</span>
                </div>

                <div
                    className='demo-log'
                    onClick={demoLogin}>Log in as Demo User</div>

                <div className="login-btns">
                    <button className="login-button" disabled={(!credential || !password)}>Login</button>
                </div>
            </form>
        </div>
    );
}

export default LoginFormPage;
