import * as sessionActions from './store/session';
import LoginFormPage from "./components/LoginFormPage";
import SignUpFormPage from "./components/SignUpFormPage";

import { Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";


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
