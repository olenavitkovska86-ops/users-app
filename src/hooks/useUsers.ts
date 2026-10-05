import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../api/users'

export const usersQueryOptions = {
  queryKey: ['users'] as const,
  // Let an in-flight request finish and fill the cache across route/StrictMode remounts.
  queryFn: () => fetchUsers(),
}

export function useUsers() {
  return useQuery(usersQueryOptions)
}
