import type { User } from '../../types/user'
import UserCard from './UserCard'

interface UserListProps {
  users: User[]
}

export default function UserList({ users }: UserListProps) {
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {users.map((user) => (
        <li key={user.id}><UserCard user={user} /></li>
      ))}
    </ul>
  )
}
