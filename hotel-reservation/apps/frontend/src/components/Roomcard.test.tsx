import { render, screen } from '@testing-library/react';
import { RoomCard } from './RoomCard';
import { Room } from '../types/Room';

describe('RoomCard', () => {
  it('muestra correctamente el número y tipo de habitación', () => {
    const room: Room = {
      id: '1',
      number: '101',
      type: 'single',
      pricePerNight: 100,
      status: 'available',
    };

    render(<RoomCard room={room} />);

    // Matchers tolerantes a texto fragmentado
    expect(screen.getByText((content) => content.includes('101'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.toLowerCase().includes('single'))).toBeInTheDocument();
  });
});
