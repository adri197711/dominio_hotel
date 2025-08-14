import type { Meta, StoryObj } from '@storybook/react';
import { RoomsPage } from '../pages/RoomsPage';

import { mockRoomAvailable, mockRoomBooked } from './fixtures';
import type { Room } from '../types/Room';

const makeRooms = (rooms: Room[]) => () => (
  <div>
    <h1>Rooms</h1>
    {rooms.map((r) => (
      <div key={r.id}>
        {r.number} - {r.status}
      </div>
    ))}
  </div>
);

const meta: Meta<typeof RoomsPage> = {
  component: RoomsPage,
  title: 'Pages/RoomsPage',
};
export default meta;

type Story = StoryObj<typeof RoomsPage>;

export const MixedStatus: Story = {
  render: makeRooms([mockRoomAvailable, mockRoomBooked]),
};

export const AllAvailable: Story = {
  render: makeRooms([
    { ...mockRoomAvailable, id: '1', number: '101' },
    { ...mockRoomAvailable, id: '2', number: '102' },
  ]),
};

export const AllBooked: Story = {
  render: makeRooms([
    { ...mockRoomBooked, id: '1', number: '103' },
    { ...mockRoomBooked, id: '2', number: '104' },
  ]),
};
