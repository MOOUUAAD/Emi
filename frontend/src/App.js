import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CounterPage from './pages/CounterPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CounterPage />} />
        <Route path="/admin" element={<AdminPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
