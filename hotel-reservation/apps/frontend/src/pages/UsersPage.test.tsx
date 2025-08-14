import { render, screen } from '@testing-library/react';
import { UsersPage } from './UsersPage';
import { UsersService } from '../api/users';
import { vi } from 'vitest';

vi.mock('../api/users');

const mockedUsers = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', role: 'guest' },
];

(UsersService.getAll as vi.Mock).mockResolvedValue(mockedUsers);

test('UsersPage carga y muestra usuarios correctamente', async () => {
  render(<UsersPage />);

  // Spinner inicial
  expect(screen.getByRole('status', { name: /cargando/i })).toBeInTheDocument();

  // Usuario cargado
  expect(await screen.findByText(/Juan Pérez/)).toBeInTheDocument();
});
