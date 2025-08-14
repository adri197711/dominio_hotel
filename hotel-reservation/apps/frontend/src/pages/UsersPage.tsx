// UsersPage.tsx
import { useEffect, useState } from "react";
import { UserCard } from "../components/UserCard";
import { UsersService } from "../api/users";

export function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    UsersService.getAll().then(setUsers);
  }, []);

  return (
    <div>
      <h1>Usuarios</h1>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
}
