import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})
const originalFetch = globalThis.fetch
let queryClient

try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const { demoUsers } = await server.ssrLoadModule('/src/data/demoUsers.ts')
  const { UsersApiError } = await server.ssrLoadModule('/src/api/users.ts')
  const { usersQueryOptions, useUsers } = await server.ssrLoadModule('/src/hooks/useUsers.ts')
  const { getUsersRetryAt, getUsersErrorMessage } = await server.ssrLoadModule('/src/lib/usersError.ts')
  queryClient = (await server.ssrLoadModule('/src/lib/queryClient.ts')).queryClient
  const paths = ['/dashboard', '/users', '/users/1']

  function render(path) {
    return renderToStaticMarkup(createElement(QueryClientProvider, { client: queryClient },
      createElement(MemoryRouter, { initialEntries: [path] }, createElement(App))))
  }

  let captured
  function Probe() {
    // oxlint-disable-next-line react/globals -- Capture the hook result in this isolated SSR test.
    captured = useUsers()
    return null
  }

  function getHook() {
    renderToStaticMarkup(createElement(QueryClientProvider, { client: queryClient }, createElement(Probe)))
    return captured
  }

  const scenarios = [
    ['network', async () => { throw new TypeError('mock raw network message') }, 'internetanslutning'],
    ['401', async () => new Response('', { status: 401 }), 'Åtkomsten kunde inte bekräftas'],
    ['403', async () => new Response('', { status: 403 }), 'Tjänsten tillåter inte åtkomst'],
    ['429', async () => new Response('', { status: 429 }), 'För många förfrågningar'],
    ['500', async () => new Response('', { status: 500 }), 'tillfälligt problem'],
    ['invalid JSON', async () => new Response('{invalid'), 'svar kunde inte läsas'],
    ['invalid structure', async () => Response.json([{ id: 1 }]), 'ofullständiga eller oväntade'],
  ]
  for (const [name, fetchMock, message] of scenarios) {
    queryClient.clear()
    globalThis.fetch = fetchMock
    await assert.rejects(queryClient.fetchQuery(usersQueryOptions))
    for (const path of paths) {
      const html = render(path)
      assert.ok(html.includes(message))
      assert.ok(html.includes('Försök igen'))
      assert.ok(!html.includes('Users API error:'))
      assert.ok(!html.includes('mock raw network message'))
      assert.ok(!html.includes('Användaren hittades inte'))
      if (name === '429') assert.match(html, /<button[^>]*disabled/)
    }
    console.log(`PASS: ${name} friendly message on all three pages.`)
  }

  const now = Math.floor(Date.now() / 1000) * 1000
  const values = [
    ['120', now + 120000], ['0', now],
    [new Date(now + 120000).toUTCString(), now + 120000],
    [new Date(now - 120000).toUTCString(), now],
    [null, now + 60000], ['invalid', now + 60000], ['-1', now + 60000], ['1.5', now + 60000],
  ]
  for (const [header, expected] of values) {
    assert.equal(getUsersRetryAt(new UsersApiError('http', 429, header), now), expected)
  }
  assert.equal(getUsersRetryAt(new UsersApiError('http', 500), now), 0)
  assert.equal(getUsersErrorMessage(new Error('private detail')), 'Något gick fel. Försök igen senare.')
  console.log('PASS: Retry-After seconds/date/fallback and safe unknown error.')

  queryClient.clear()
  globalThis.fetch = async () => new Response('', { status: 429 })
  await assert.rejects(queryClient.fetchQuery(usersQueryOptions))
  let calls = 0
  globalThis.fetch = async () => { calls++; return Response.json(demoUsers) }
  const cooldownHook = getHook()
  cooldownHook.retryUsers()
  cooldownHook.retryUsers()
  assert.equal(calls, 0)
  for (const path of paths) assert.match(render(path), /<button[^>]*disabled/)
  const query = queryClient.getQueryCache().find({ queryKey: ['users'] })
  query.setState({ errorUpdatedAt: Date.now() - 61000 })
  getHook().retryUsers()
  await queryClient.fetchQuery(usersQueryOptions)
  assert.equal(calls, 1)
  console.log('PASS: shared cooldown blocks retry; expired cooldown allows one request.')

  globalThis.fetch = async () => { throw new TypeError('mock refresh failure') }
  await assert.rejects(queryClient.fetchQuery({ ...usersQueryOptions, staleTime: 0 }))
  let release
  const gate = new Promise((resolve) => { release = resolve })
  calls = 0
  globalThis.fetch = async () => { calls++; await gate; return Response.json(demoUsers) }
  const retryHook = getHook()
  retryHook.retryUsers()
  retryHook.retryUsers()
  assert.equal(calls, 1)
  const retrying = render('/users')
  assert.match(retrying, /<button[^>]*disabled/)
  assert.ok(retrying.includes(demoUsers[0].profile.name))
  release()
  await queryClient.fetchQuery(usersQueryOptions)
  assert.ok(!render('/users').includes('Uppdateringen misslyckades'))
  console.log('PASS: duplicate retry prevented, button disabled, cached data retained, success clears error.')

  for (const data of [demoUsers, []]) {
    queryClient.setQueryData(['users'], data)
    globalThis.fetch = async () => new Response('', { status: 503 })
    await assert.rejects(queryClient.fetchQuery({ ...usersQueryOptions, staleTime: 0 }))
    for (const path of paths) {
      const html = render(path)
      assert.ok(html.includes('Uppdateringen misslyckades'))
      assert.ok(html.includes('Tidigare hämtade uppgifter visas fortfarande.'))
      assert.ok(html.includes(data.length ? (path === '/dashboard' ? 'Totalt antal användare' : demoUsers[0].profile.name) : 'Inga användare'))
    }
  }
  console.log('PASS: background errors preserve populated and empty cached arrays.')
} finally {
  globalThis.fetch = originalFetch
  queryClient?.clear()
  await server.close()
}
