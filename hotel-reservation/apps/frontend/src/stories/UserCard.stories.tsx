import type { Meta, StoryObj } from '@storybook/react';
import { UserCard } from '../components/UserCard';
import { mockUserGuest, mockUserAdmin } from './fixtures';

const meta: Meta<typeof UserCard> = {
  component: UserCard,
  title: 'Components/UserCard',
};
export default meta;

type Story = StoryObj<typeof UserCard>;


export const Guest: Story = { args: { user: mockUserGuest } };
export const Admin: Story = { args: { user: mockUserAdmin } };