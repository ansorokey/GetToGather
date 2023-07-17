import * as sessionActions from './store/session';

import { Switch, Route, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useModalContext } from './Context/ModalContext';

import Modal from './components/Modal';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import LoginFormPage from "./components/LoginFormPage";
import GroupsListing from './components/GroupsListing';
import EventsListing from './components/EventsListing';
import SignUpFormPage from "./components/SignUpFormPage";


function App() {
  const dispatch = useDispatch();

  const {showModal} = useModalContext();
  const [firstLoad, setFirstLoad] = useState(false);

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

        <Route>
          <h1>Sorry</h1>
          <h2>The page you are looking for couldn't be found...</h2>
        </Route>
      </Switch>
    </>
  );
}

export default App;
