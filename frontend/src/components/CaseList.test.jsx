// Prueba unitaria para CaseList
import { render, screen } from '@testing-library/react';
import CaseList from './CaseList';
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

describe('CaseList', () => {
  it('renderiza la lista de casos', () => {
    renderWithProviders(<CaseList />);

    // Verificamos si hay algún texto que indique "casos", puede ajustarse según el contenido real
    expect(screen.getByText(/caso/i)).toBeInTheDocument();
  });
});
