import type { Meta, StoryObj } from '@storybook/react';
import { RoomCard } from '../components/RoomCard';
import { mockRoomAvailable, mockRoomBooked } from './fixtures';

const meta: Meta<typeof RoomCard> = {
  component: RoomCard,
  title: 'Components/RoomCard',
};
export default meta;

type Story = StoryObj<typeof RoomCard>;

export const Available: Story = { args: { room: mockRoomAvailable } };
export const Booked: Story = { args: { room: mockRoomBooked } };
