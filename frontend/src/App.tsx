import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LatestGrid from "./components/LatestGrid/LatestGrid";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";


import './App.css';

function App() {
  return (
    <div>
      <Header />
      <BrowserRouter>
          <Switch>
              <Route path="/" component={LatestGrid}/>
          </Switch>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
