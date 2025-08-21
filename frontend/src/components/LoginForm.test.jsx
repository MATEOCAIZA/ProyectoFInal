// LoginForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from './LoginForm'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthProvider } from '../context/AuthContext'
import { MemoryRouter } from 'react-router-dom'

// --- mocks de dependencias externas ---
vi.mock('../api/authApi', () => ({
  loginUser: vi.fn(),
}))

// mock de useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})


// mock del contexto de autenticación
const mockLogin = vi.fn()
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext')
  return {
    ...actual,
    useAuth: () => ({ login: mockLogin }),
  }
})

import { loginUser } from '../api/authApi'

// helper para renderizar con router y provider
function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza título e inputs', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/usuario/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument()
  })

  it('permite escribir en los campos', () => {
    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
      target: { value: 'mateo' },
    })
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: '1234' },
    })

    expect(screen.getByPlaceholderText(/usuario/i).value).toBe('mateo')
    expect(screen.getByPlaceholderText(/contraseña/i).value).toBe('1234')
  })

  it('login exitoso con rol abogada redirige a dashboard-abogado', async () => {
    loginUser.mockResolvedValueOnce({
      user: { username: 'mateo', role: 'abogada' },
      token: '123',
    })

    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
      target: { value: 'mateo' },
    })
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: '1234' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /ingresar/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'mateo',
        role: 'abogada',
        token: '123',
      })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard-abogado')
    })
  })



  it('login exitoso con rol lector redirige a dashboard-usuario', async () => {
    loginUser.mockResolvedValueOnce({
      user: { username: 'juan', role: 'lector' },
      token: '456',
    })

    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
      target: { value: 'juan' },
    })
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'test' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /ingresar/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard-usuario')
    })
  })

  it('muestra error si las credenciales son inválidas', async () => {
    loginUser.mockRejectedValueOnce(new Error('Invalid credentials'))

    renderWithProviders(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
      target: { value: 'wrong' },
    })
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), {
      target: { value: 'badpass' },
    })

    fireEvent.submit(screen.getByRole('button', { name: /ingresar/i }))

    expect(await screen.findByText(/credenciales inválidas/i)).toBeInTheDocument()
  })

  it('contiene un enlace para ir al registro', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByText(/no tienes cuenta/i)).toHaveAttribute('href', '/register')
  })
})
