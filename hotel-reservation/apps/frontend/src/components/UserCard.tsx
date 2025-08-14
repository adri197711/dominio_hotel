import { User } from "../types/user";

interface Props {
  user: User;
}

export function UserCard({ user }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {user.createdAt && <p>Created: {user.createdAt.toLocaleDateString()}</p>}
    </div>
  );
}
