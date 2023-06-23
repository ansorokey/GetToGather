import LoginFormPage from "./components/LoginFormPage";

import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";

import * as sessionActions from './store/session';

function App() {
  const dispatch = useDispatch();
  const [firstLoad, setFirstLoad] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUserThunk());
    setFirstLoad(true);
  }, [dispatch]);

  if(!firstLoad) return <h1>Loading...</h1>;

  return (
    <>
      <Switch>
        <Route exact path="/login">
          <LoginFormPage />
        </Route>

        <Route exact path="/">
          <h1>Hello from App</h1>
        </Route>
      </Switch>
    </>
  );
}

export default App;
