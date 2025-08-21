import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // ← Importar la nueva página
import DashboardAbogado from './pages/DashboardAbogado';
import DashboardUsuario from './pages/DashboardUsuario';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* ← Nueva ruta */}
          <Route path="/dashboard-abogado" element={<DashboardAbogado />} />
          <Route path="/dashboard-usuario" element={<DashboardUsuario />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
