import { User } from "../types/User";

interface Props {
  user: User;
}

export function UserCard({ user }: Props) {
  return (
<div>
      <div>{user.name}</div>
      <div>Email: {user.email}</div>
      <div>Role: {user.role}</div>
      {user.createdAt && <div>Created: {user.createdAt.toLocaleDateString()}</div>}
    </div>
  );
}
