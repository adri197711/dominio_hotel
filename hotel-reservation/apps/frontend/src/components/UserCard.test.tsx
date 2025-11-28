import "@testing-library/jest-dom"
import { describe, test, expect } from "vitest";
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';
import { User } from '../types/User';

describe('UserCard', () => {
  test('muestra correctamente el nombre y email del usuario', () => {
    const user: User = {
      id: '1',
      name: 'Juan',
      email: 'juan@example.com',
      password: '',
      role: 'guest',
    };

    render(<UserCard user={user} />);

    expect(screen.getByText((content) => content.includes('Juan'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('juan@example.com'))).toBeInTheDocument();
  });
});
