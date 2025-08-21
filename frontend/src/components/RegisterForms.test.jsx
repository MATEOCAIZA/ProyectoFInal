// RegisterForms.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterForms from './RegisterForms';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe('RegisterForms', () => {
  it('renderiza todos los campos del formulario', () => {
    renderWithProviders(<RegisterForms onRegister={() => {}} />);

    expect(screen.getByPlaceholderText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/teléfono/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
  });

  it('permite escribir en los campos', () => {
    renderWithProviders(<RegisterForms onRegister={() => {}} />);

    fireEvent.change(screen.getByPlaceholderText(/nombre de usuario/i), {
      target: { value: 'mateo' },
    });
    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
      target: { value: 'mateo@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByPlaceholderText(/teléfono/i), {
      target: { value: '0999999999' },
    });

    expect(screen.getByPlaceholderText(/nombre de usuario/i).value).toBe('mateo');
    expect(screen.getByPlaceholderText(/correo electrónico/i).value).toBe('mateo@test.com');
    expect(screen.getByPlaceholderText(/contraseña/i).value).toBe('12345');
    expect(screen.getByPlaceholderText(/teléfono/i).value).toBe('0999999999');
  });

  it('llama a onRegister con los datos correctos al enviar el formulario', () => {
    const mockOnRegister = vi.fn();
    renderWithProviders(<RegisterForms onRegister={mockOnRegister} />);

    fireEvent.change(screen.getByPlaceholderText(/nombre de usuario/i), {
      target: { value: 'mateo' },
    });
    fireEvent.change(screen.getByPlaceholderText(/correo electrónico/i), {
      target: { value: 'mateo@test.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: '12345' },
    });
    fireEvent.change(screen.getByPlaceholderText(/teléfono/i), {
      target: { value: '0999999999' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /registrarse/i }));

    expect(mockOnRegister).toHaveBeenCalledWith({
      username: 'mateo',
      email: 'mateo@test.com',
      password: '12345',
      phone_number: '0999999999',
      role: 'lector',
    });
  });

  it('contiene un enlace para volver al login', () => {
    renderWithProviders(<RegisterForms onRegister={() => {}} />);
    expect(screen.getByText(/ya tienes una cuenta/i)).toHaveAttribute('href', '/');
  });
});
