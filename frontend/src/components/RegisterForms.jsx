import { useState } from 'react';

export default function RegisterForms({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    role: 'lector',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-md text-white space-y-4"
    >
      <input
        type="text"
        name="username"
        placeholder="Nombre de usuario"
        value={formData.username}
        onChange={handleChange}
        className="w-full p-2 border rounded bg-gray-700 text-white placeholder-gray-400"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 border rounded bg-gray-700 text-white placeholder-gray-400"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 border rounded bg-gray-700 text-white placeholder-gray-400"
        required
      />
      <input
        type="text"
        name="phone_number"
        placeholder="Teléfono (opcional)"
        value={formData.phone_number}
        onChange={handleChange}
        className="w-full p-2 border rounded bg-gray-700 text-white placeholder-gray-400"
      />
      <input type="hidden" name="role" value={formData.role} />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Registrarse
      </button>

      {/* Enlace para volver al login */}
      <div className="text-center mt-2">
        <a href="/" className="text-sm text-blue-400 hover:underline">
          ¿Ya tienes una cuenta? Inicia sesión
        </a>
      </div>
    </form>
  );
}
