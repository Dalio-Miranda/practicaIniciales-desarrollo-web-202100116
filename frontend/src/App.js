import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import CrearPublicacion from './pages/CrearPublicacion';
import Perfil from './pages/Perfil';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/home" element={<><Navbar /><Home /></>} />
        <Route path="/crear-publicacion" element={<><Navbar /><CrearPublicacion /></>} />
        <Route path="/perfil/:registro" element={<><Navbar /><Perfil /></>} />
      </Routes>
    </Router>
  );
}

export default App;