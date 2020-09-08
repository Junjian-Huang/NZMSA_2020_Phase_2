import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LatestGrid from "./components/LatestGrid/LatestGrid";

import './App.css';

function App() {
  return (
    <div>
      <BrowserRouter>
          <Switch>
              <Route path="/" component={LatestGrid}/>
          </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
