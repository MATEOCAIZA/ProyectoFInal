import { useState } from 'react';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user, token } = await loginUser({ username, password });

      // Guardar los datos de sesión
      login({ username: user.username, role: user.role, token });

      // Redirigir según el rol
      if (user.role === 'abogada') {
        navigate('/dashboard-abogado');
      } else if (user.role === 'admin') {
        navigate('/dashboard-admin');
      } else {
        navigate('/dashboard-usuario');
      }
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-6 rounded shadow-md w-full max-w-md mx-auto text-white"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700 focus:outline-none"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-3 rounded bg-gray-800 border border-gray-700 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded"
      >
        Ingresar
      </button>
      {/* Enlace para ir a registrar */}
      <div className="text-center mt-3">
        <a href="/register" className="text-blue-400 hover:underline text-sm">
          ¿No tienes cuenta? Regístrate aquí
        </a>
      </div>
    </form>
  );
}
