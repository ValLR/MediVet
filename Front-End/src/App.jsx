import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './views/Login';
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Rutas de Administrador / Veterinario */}
        <Route path="/dashboard-admin" element={<AdminLayout />}>
          <Route index element={<div>Admin Dashboard Inicio</div>} />
          <Route path="agenda" element={<div>Agenda (Calendario)</div>} />
          <Route path="pacientes" element={<div>Lista de Pacientes</div>} />
          <Route path="historial" element={<div>Historial Atenciones</div>} />
        </Route>

        {/* Rutas de Dueño (Usuario) */}
        <Route path="/dashboard-user" element={<UserLayout />}>
          <Route index element={<div>Mis Mascotas</div>} />
          <Route path="agendar" element={<div>Agendar Cita</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
