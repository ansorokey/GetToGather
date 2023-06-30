import * as sessionActions from './store/session';
import LoginFormPage from "./components/LoginFormPage";
import SignUpFormPage from "./components/SignUpFormPage";
import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation';
import Modal from './components/Modal';

import { Switch, Route, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useModalContext } from './Context/ModalContext';
import GroupsListing from './components/GroupsListing';
import EventsListing from './components/EventsListing';
import { UseSelector, useSelector } from 'react-redux/es/hooks/useSelector';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


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
      {showModal && <Modal />}
      <Navigation firstLoad={firstLoad}/>
      <Switch>
        <Route exact path="/login">
          <LoginFormPage />
        </Route>

        <Route exact path="/signup">
          <SignUpFormPage/>
        </Route>

        <Route path="/events">
            <EventsListing/>
        </Route>

        <Route path="/groups">
          <GroupsListing/>
        </Route>

        <Route exact path="/">
          <LandingPage/>
        </Route>
      </Switch>
    </>
  );
}

export default App;
