import React from 'react';
import Home from './home/Home.js'
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Home />
      </BrowserRouter>

    </div>
  );
}

export default App;
