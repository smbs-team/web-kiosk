import React from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';

import Login from './components/Login';
import Kiosk from './components/Clocking';

function App() { 
  return (
    <Router>
      <Route exact path="/login" component={Login} />
      <Route exact path="/kiosk" component={Kiosk} />
      <Redirect 
        to="/login"
      />
    </Router>
  );
}

export default App;
