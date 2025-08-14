import type { Meta, StoryObj } from '@storybook/react';
import { ReservationCard } from '../components/ReservationCard';
import { mockReservationPending, mockReservationCompleted, mockReservationCancelled } from './fixtures';

const meta: Meta<typeof ReservationCard> = {
  component: ReservationCard,
  title: 'Components/ReservationCard',
};
export default meta;

type Story = StoryObj<typeof ReservationCard>;

export const Pending: Story = { args: { reservation: mockReservationPending } };
export const Completed: Story = { args: { reservation: mockReservationCompleted } };
export const Cancelled: Story = { args: { reservation: mockReservationCancelled } };
