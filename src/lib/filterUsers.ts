import type { User } from '../types/user'

export function filterUsers(users: User[], search: string) {
  const query = search.trim().toLowerCase()
  if (query === '') return users

  return users.filter((user) => [
    user.profile.name,
    user.username,
    user.profile.email,
    user.profile.address.city,
  ].some((value) => value.toLowerCase().includes(query)))
}
