import { useEffect, useState } from "react";
import { AuthService } from '../api/AuthService';
import { UsersService } from "../api/UsersService";
import { User } from "../types/User";
import { Spinner } from "../components/Spinner";
import { ErrorMessage } from "../components/ErrorMessage";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = () => {
    setLoading(true);
    setError(null);

    if (!AuthService.isAuthenticated()) {
      setError("No autorizado");
      setLoading(false);
      return;
    }

    UsersService.getAll()
      .then(data => setUsers(data))
      .catch(() => setError("No se pudieron cargar los usuarios"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadUsers} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id} className="border-b py-2">
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
