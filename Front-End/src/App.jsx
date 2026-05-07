import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './views/Login';
import AdminLayout from './components/layouts/AdminLayout';
import UserLayout from './components/layouts/UserLayout';
import DashboardAdmin from './views/DashboardAdmin';
import DashboardUser from './views/DashboardUser';
import PatientRegistration from './views/PatientRegistration';
import ScheduleAppointment from './views/ScheduleAppointment';
import AppointmentsHistory from './views/AppointmentsHistory';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Rutas de Administrador / Veterinario */}
        <Route path="/dashboard-admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="agenda" element={<ScheduleAppointment />} />
          <Route path="pacientes" element={<PatientRegistration />} />
          <Route path="historial" element={<AppointmentsHistory />} />
        </Route>

        {/* Rutas de Dueño (Usuario) */}
        <Route path="/dashboard-user" element={<UserLayout />}>
          <Route index element={<DashboardUser />} />
          <Route path="agendar" element={<ScheduleAppointment />} />
          <Route path="historial" element={<AppointmentsHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
