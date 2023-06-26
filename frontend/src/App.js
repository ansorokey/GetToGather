import * as sessionActions from './store/session';
import LoginFormPage from "./components/LoginFormPage";
import SignUpFormPage from "./components/SignUpFormPage";
import Navigation from './components/Navigation';
import Modal from './components/Modal';

import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useModalContext } from './Context/ModalContext';


function App() {
  const dispatch = useDispatch();
  const [firstLoad, setFirstLoad] = useState(false);
  const {showModal} = useModalContext();

  useEffect(() => {
    dispatch(sessionActions.restoreUserThunk());
    setFirstLoad(true);
  }, [dispatch]);

  if(!firstLoad) return <h1>Loading...</h1>;

  return (
    <>
      <Navigation firstLoad={firstLoad}/>
      {showModal && <Modal />}
      <Switch>
        <Route exact path="/login">
          <LoginFormPage />
        </Route>

        <Route exact path="/signup">
          <SignUpFormPage/>
        </Route>

        <Route exact path="/">
          <h1>Hello from App</h1>
        </Route>
      </Switch>
    </>
  );
}

export default App;
