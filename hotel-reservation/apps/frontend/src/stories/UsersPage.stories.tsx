import type { Meta, StoryObj } from '@storybook/react';
import { UsersPage } from '../pages/UsersPage';
import { User } from '../types/user';
import { mockUserGuest, mockUserAdmin } from './fixtures';

const makeUsers = (users: User[]) => () => (
  <div>
    <h1>Users</h1>
    {users.map((u) => (
      <div key={u.id}>
        {u.name} - {u.role}
      </div>
    ))}
  </div>
);

const meta: Meta<typeof UsersPage> = {
  component: UsersPage,
  title: 'Pages/UsersPage',
};
export default meta;

type Story = StoryObj<typeof UsersPage>;

export const MixedRoles: Story = {
  render: makeUsers([mockUserGuest, mockUserAdmin]),
};

export const OnlyGuests: Story = {
  render: makeUsers([
    { ...mockUserGuest, id: 'u1', name: 'Juan Pérez' },
    { ...mockUserGuest, id: 'u2', name: 'Laura Díaz' },
  ]),
};

export const OnlyAdmins: Story = {
  render: makeUsers([
    { ...mockUserAdmin, id: 'u3', name: 'Ana López' },
    { ...mockUserAdmin, id: 'u4', name: 'Carlos Romero' },
  ]),
};
