import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider, QueryObserver } from '@tanstack/react-query'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})
const originalFetch = globalThis.fetch
let queryClient
let calls = 0

try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const { demoUsers } = await server.ssrLoadModule('/src/data/demoUsers.ts')
  const { usersQueryOptions } = await server.ssrLoadModule('/src/hooks/useUsers.ts')
  queryClient = (await server.ssrLoadModule('/src/lib/queryClient.ts')).queryClient

  function render(path) {
    return renderToStaticMarkup(createElement(QueryClientProvider, { client: queryClient },
      createElement(MemoryRouter, { initialEntries: [path] }, createElement(App))))
  }

  const paths = ['/dashboard', '/users', '/users/1']
  globalThis.fetch = async () => { assert.fail('SSR loading must not start fetch') }
  for (const path of paths) {
    const html = render(path)
    assert.ok(html.includes('Hämtar användare'))
    assert.ok(!html.includes('Användaren hittades inte'))
  }
  console.log('PASS: initial loading on three pages; no premature user-not-found.')

  let release
  const gate = new Promise((resolve) => { release = resolve })
  globalThis.fetch = async () => { calls++; await gate; return Response.json(demoUsers) }
  const first = new QueryObserver(queryClient, usersQueryOptions)
  const unsubscribe = first.subscribe(() => {})
  assert.equal(calls, 1)
  unsubscribe()
  const second = new QueryObserver(queryClient, usersQueryOptions)
  const unsubscribeSecond = second.subscribe(() => {})
  assert.equal(calls, 1)
  release()
  await queryClient.fetchQuery(usersQueryOptions)
  unsubscribeSecond()
  assert.equal(calls, 1)
  console.log('PASS: unmount/remount shares one in-flight request.')

  for (const path of [...paths, '/users/999', '/users/abc', '/unknown-page']) render(path)
  assert.equal(calls, 1)
  assert.equal(queryClient.getQueryCache().getAll().length, 1)
  assert.ok(render('/users/1').includes(demoUsers[0].profile.name))
  console.log('PASS: six route renders reuse a single users cache.')

  queryClient.setQueryData(['users'], demoUsers, { updatedAt: Date.now() - 2 * 60 * 60 * 1000 })
  const staleObserver = new QueryObserver(queryClient, usersQueryOptions)
  const unsubscribeStale = staleObserver.subscribe(() => {})
  assert.equal(calls, 1)
  unsubscribeStale()
  console.log('PASS: mounting with stale cached data does not refetch.')

  queryClient.clear()
  queryClient.setQueryData(['users'], [])
  for (const path of paths) assert.ok(render(path).includes('Inga användare'))
  console.log('PASS: empty array on all three pages.')

  queryClient.clear()
  globalThis.fetch = async () => { calls++; throw new TypeError('mock network failure') }
  await assert.rejects(queryClient.fetchQuery(usersQueryOptions))
  const callsAfterFailure = calls
  for (const path of paths) {
    const html = render(path)
    assert.ok(html.includes('Kunde inte hämta användarna'))
    assert.ok(!html.includes('Användaren hittades inte'))
  }
  const failedObserver = new QueryObserver(queryClient, usersQueryOptions)
  const unsubscribeFailed = failedObserver.subscribe(() => {})
  assert.equal(calls, callsAfterFailure)
  unsubscribeFailed()
  console.log('PASS: initial failure stays an error; remount does not retry.')

  queryClient.setQueryData(['users'], demoUsers)
  await assert.rejects(queryClient.fetchQuery({ ...usersQueryOptions, staleTime: 0 }))
  for (const path of paths) {
    const html = render(path)
    assert.ok(html.includes('Uppdateringen misslyckades'))
    assert.ok(html.includes(path === '/dashboard' ? 'Totalt antal användare' : demoUsers[0].profile.name))
  }
  console.log('PASS: background error retains useful cached data.')

  const options = queryClient.getDefaultOptions().queries
  assert.equal(options.staleTime, 60 * 60 * 1000)
  assert.equal(options.gcTime, 24 * 60 * 60 * 1000)
  for (const key of ['retry', 'retryOnMount', 'refetchOnMount', 'refetchOnWindowFocus', 'refetchOnReconnect']) {
    assert.equal(options[key], false)
  }
  assert.equal(options.refetchInterval, undefined)
  console.log('PASS: cache durations and disabled automatic refetch/retry; no polling.')
} finally {
  globalThis.fetch = originalFetch
  queryClient?.clear()
  await server.close()
}
