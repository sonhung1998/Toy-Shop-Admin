import React from 'react';
import Home from './home/Home.js'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LoginForm from './login/Login.js';
import PrivateRouter from './Utils/PrivateRoute.js'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <PrivateRouter component={Home} />
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
