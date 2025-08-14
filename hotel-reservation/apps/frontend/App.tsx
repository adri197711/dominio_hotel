import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { UsersPage } from './pages/UsersPage';
import { RoomsPage } from './pages/RoomsPage';
import { ReservationsPage } from './pages/ReservationsPage';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-blue-600 text-white p-4 flex justify-between">
          <h1 className="font-bold text-lg">Hotel Management</h1>
          <div className="space-x-4">
            <Link to="/users" className="hover:underline">Users</Link>
            <Link to="/rooms" className="hover:underline">Rooms</Link>
            <Link to="/reservations" className="hover:underline">Reservations</Link>
          </div>
        </nav>

        {/* Main content */}
        <main className="p-6">
          <Routes>
            <Route path="/" element={<RoomsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
