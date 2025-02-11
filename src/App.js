import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ModelsPage from './ModelsPage/ModelsPage';
import Home from './Home/Home';
import Add from './add/Add';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/add" element={<Add />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;