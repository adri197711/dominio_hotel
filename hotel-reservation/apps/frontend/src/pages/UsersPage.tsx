import { useEffect, useState, useCallback } from "react";
import { User } from "../types/User";
import { Spinner } from "../components/Spinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { AuthService, UsersService } from "../api/users";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(() => {
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
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1>Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}