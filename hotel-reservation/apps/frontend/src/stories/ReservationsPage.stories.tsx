import type { Meta, StoryObj } from '@storybook/react';
import { ReservationsPage } from '../pages/ReservationsPage';
import { Reservation } from '../types/Reservation';
import { mockReservationPending, mockReservationCompleted, mockReservationCancelled } from './fixtures';

const makeReservations = (reservations: Reservation[]) => () => (
  <div>
    <h1>Reservations</h1>
    {reservations.map((r) => (
      <div key={r.id}>
        {r.id} - {r.status} (${r.totalPrice})
      </div>
    ))}
  </div>
);

const meta: Meta<typeof ReservationsPage> = {
  component: ReservationsPage,
  title: 'Pages/ReservationsPage',
};
export default meta;

type Story = StoryObj<typeof ReservationsPage>;

export const MixedStatuses: Story = {
  render: makeReservations([
    mockReservationPending,
    mockReservationCompleted,
    mockReservationCancelled,
  ]),
};

export const AllPending: Story = {
  render: makeReservations([
    { ...mockReservationPending, id: 'r1' },
    { ...mockReservationPending, id: 'r2' },
  ]),
};

export const AllCompleted: Story = {
  render: makeReservations([
    { ...mockReservationCompleted, id: 'r3' },
    { ...mockReservationCompleted, id: 'r4' },
  ]),
};

export const AllCancelled: Story = {
  render: makeReservations([
    { ...mockReservationCancelled, id: 'r5' },
    { ...mockReservationCancelled, id: 'r6' },
  ]),
};
