import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardUsuario() {
  const { auth } = useAuth();
  const [procesos, setProcesos] = useState([]);
  const [evidencias, setEvidencias] = useState({});
  const [likes, setLikes] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [vistaActiva, setVistaActiva] = useState('inicio');
  const [perfil, setPerfil] = useState(null);

  // Nuevo: estado para edición de perfil
  const [editando, setEditando] = useState(false);
  const [formPerfil, setFormPerfil] = useState({
    email: '',
    phone_number: '',
    password: '',
    content: '',
  });
  const [mensajePerfil, setMensajePerfil] = useState('');

  useEffect(() => {
    if (!auth?.token) return;

    // Obtener procesos
    fetch('http://localhost:3000/api/processes', {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProcesos(data);

        data.forEach((proceso) => {
          fetch(
            `http://localhost:3000/api/evidences/process/${proceso.process_id}`,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`,
              },
            }
          )
            .then((res) => res.json())
            .then((evids) => {
              setEvidencias((prev) => ({
                ...prev,
                [proceso.process_id]: evids,
              }));
            })
            .catch((err) => console.error('Error al obtener evidencias', err));
        });
      })
      .catch((err) => console.error('Error al obtener procesos', err));

    // Obtener perfil del usuario
    fetch('http://localhost:3000/api/accounts/profile', {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener perfil');
        return res.json();
      })
      .then((data) => {
        setPerfil(data);
        setFormPerfil({
          email: data.email || '',
          phone_number: data.phone_number || '',
          password: '',
          content: data.profile?.content || '',
        });
      })
      .catch((err) => console.error('Error al obtener perfil', err));
  }, [auth?.token]);

  // Manejo de likes y comentarios omitido para brevedad...

  const manejarCambioPerfil = (e) => {
    const { name, value } = e.target;
    setFormPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const manejarGuardarPerfil = () => {
    // Construir payload para PUT, no enviar password si está vacío
    const payload = {
      email: formPerfil.email,
      phone_number: formPerfil.phone_number,
      content: formPerfil.content,
    };
    if (formPerfil.password.trim()) {
      payload.password = formPerfil.password;
    }

    fetch('http://localhost:3000/api/accounts/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Error al actualizar perfil');
        return res.json();
      })
      .then(() => {
        setMensajePerfil('Perfil actualizado correctamente');
        setEditando(false);
        // Actualizar perfil local con los datos editados (sin password)
        setPerfil((prev) => ({
          ...prev,
          email: formPerfil.email,
          phone_number: formPerfil.phone_number,
          profile: { content: formPerfil.content },
        }));
        setFormPerfil((prev) => ({ ...prev, password: '' })); // Limpiar password
      })
      .catch(() => {
        setMensajePerfil('Error al actualizar perfil');
      });
  };

  const renderVista = () => {
    switch (vistaActiva) {
      case 'inicio':
        // ... código existente para inicio
        return (
          <>
            <h2 className="text-3xl font-bold mb-6">Procesos Publicados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {procesos.map((proceso) => (
                <div
                  key={proceso.process_id}
                  className="bg-gray-800 p-4 rounded-lg shadow"
                >
                  <h3 className="text-xl font-semibold">{proceso.title}</h3>
                  <p className="text-gray-400 text-sm">Tipo: {proceso.type}</p>
                  <p className="text-gray-400 text-sm">
                    Provincia: {proceso.province}
                  </p>
                </div>
              ))}
            </div>
          </>
        );

      case 'perfil':
        return (
          <div>
            <h2 className="text-4xl font-bold mb-8">👤 Perfil del Usuario</h2>

            {!perfil ? (
              <p className="text-xl">Cargando perfil...</p>
            ) : (
              <div className="bg-gray-800 p-8 rounded-2xl w-full max-w-4xl shadow-xl text-white text-xl space-y-6">
                {mensajePerfil && (
                  <div className="mb-4 p-3 bg-green-600 rounded">
                    {mensajePerfil}
                  </div>
                )}

                {!editando ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <p>
                          <span className="font-semibold">
                            👤 Nombre de usuario:
                          </span>{' '}
                          {perfil.username}
                        </p>
                        <p>
                          <span className="font-semibold">📧 Correo:</span>{' '}
                          {perfil.email}
                        </p>
                        <p>
                          <span className="font-semibold">📱 Teléfono:</span>{' '}
                          {perfil.phone_number}
                        </p>
                      </div>
                      <div className="space-y-4">
                        <p>
                          <span className="font-semibold">🎓 Rol:</span>{' '}
                          {perfil.role}
                        </p>
                        <p>
                          <span className="font-semibold">📝 Descripción:</span>{' '}
                          {perfil.profile?.content || 'Sin descripción'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditando(true);
                        setMensajePerfil('');
                        setFormPerfil({
                          email: perfil.email || '',
                          phone_number: perfil.phone_number || '',
                          password: '',
                          content: perfil.profile?.content || '',
                        });
                      }}
                      className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700"
                    >
                      Editar Perfil
                    </button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4 max-w-xl">
                      <label className="block">
                        <span className="font-semibold">
                          Correo electrónico:
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={formPerfil.email}
                          onChange={manejarCambioPerfil}
                          className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                      </label>

                      <label className="block">
                        <span className="font-semibold">Teléfono:</span>
                        <input
                          type="text"
                          name="phone_number"
                          value={formPerfil.phone_number}
                          onChange={manejarCambioPerfil}
                          className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                      </label>

                      <label className="block">
                        <span className="font-semibold">
                          Contraseña:{' '}
                          <small>(dejar vacío para no cambiar)</small>
                        </span>
                        <input
                          type="password"
                          name="password"
                          value={formPerfil.password}
                          onChange={manejarCambioPerfil}
                          className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                      </label>

                      <label className="block">
                        <span className="font-semibold">Descripción:</span>
                        <textarea
                          name="content"
                          value={formPerfil.content}
                          onChange={manejarCambioPerfil}
                          rows={4}
                          className="w-full p-2 rounded bg-gray-700 text-white"
                        />
                      </label>
                    </div>

                    <div className="mt-6 space-x-4">
                      <button
                        onClick={manejarGuardarPerfil}
                        className="bg-green-600 px-6 py-3 rounded hover:bg-green-700"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setEditando(false);
                          setMensajePerfil('');
                          setFormPerfil({
                            email: perfil.email || '',
                            phone_number: perfil.phone_number || '',
                            password: '',
                            content: perfil.profile?.content || '',
                          });
                        }}
                        className="bg-red-600 px-6 py-3 rounded hover:bg-red-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );

      default:
        return <p>Vista no disponible.</p>;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4">
        <h1 className="text-xl font-bold mb-6">👩‍⚖️ Abg. Luz Romero</h1>
        <nav className="space-y-4">
          <button
            onClick={() => setVistaActiva('inicio')}
            className="block w-full text-left hover:text-green-400"
          >
            🏠 Inicio
          </button>
          <button
            onClick={() => setVistaActiva('perfil')}
            className="block w-full text-left hover:text-green-400"
          >
            👤 Perfil
          </button>
          <Link to="/" className="block hover:text-red-400">
            🚪 Salir
          </Link>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6">{renderVista()}</div>
    </div>
  );
}

export default DashboardUsuario;
