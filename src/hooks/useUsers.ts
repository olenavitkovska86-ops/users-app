import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../api/users'
import { queryClient } from '../lib/queryClient'
import { getUsersRetryAt } from '../lib/usersError'

export const usersQueryOptions = {
  queryKey: ['users'] as const,
  // Let an in-flight request finish and fill the cache across route/StrictMode remounts.
  queryFn: () => fetchUsers(),
}

export function useUsers() {
  const query = useQuery(usersQueryOptions)
  const retryAt = getUsersRetryAt(query.error, query.errorUpdatedAt)

  function retryUsers() {
    const state = queryClient.getQueryState(usersQueryOptions.queryKey)
    if (Date.now() < getUsersRetryAt(state?.error, state?.errorUpdatedAt ?? 0)) return
    if (state && state.fetchStatus !== 'idle') return
    void query.refetch()
  }

  return { ...query, retryAt, retryUsers }
}
