// Prueba unitaria para CaseDetail
import { render, screen } from '@testing-library/react';
import CaseDetail from './CaseDetail';
import { describe, it, expect } from 'vitest';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

function renderWithProviders(ui) {
  return render(
    <MemoryRouter>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

describe('CaseDetail', () => {
  it('renderiza los detalles del caso', () => {
    renderWithProviders(<CaseDetail />);

    // Busca un elemento común, como título, botón o texto descriptivo
    expect(screen.getByText(/detalle/i)).toBeInTheDocument();
  });
});
