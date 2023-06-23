import LoginFormPage from "./components/LoginFormPage";

import { Switch, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/">
          <h1>Hello from App</h1>
        </Route>

        <Route exact path="/login">
          <LoginFormPage />
        </Route>
      </Switch>
    </>
  );
}

export default App;
