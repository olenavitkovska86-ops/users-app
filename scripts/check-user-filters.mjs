import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
const originalFetch = globalThis.fetch
let client
try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const { demoUsers } = await server.ssrLoadModule('/src/data/demoUsers.ts')
  const { selectUsers, getActiveUserFilters, clearUserFilters } = await server.ssrLoadModule('/src/lib/userFilters.ts')
  const { filterUsers } = await server.ssrLoadModule('/src/lib/filterUsers.ts')
  client = (await server.ssrLoadModule('/src/lib/queryClient.ts')).queryClient
  client.setQueryData(['users'], demoUsers)
  globalThis.fetch = () => assert.fail('Filters must not request the API')
  const original = structuredClone(demoUsers)
  function render(entry) {
    return renderToStaticMarkup(createElement(QueryClientProvider, { client },
      createElement(MemoryRouter, { initialEntries: [entry] }, createElement(App))))
  }
  const cases = [
    ['role=user', [1, 3, 4]], ['role=admin', [1]], ['role=editor', [2]], ['role=support', [3]],
    ['theme=light', [1, 3]], ['theme=dark', [2, 4]], ['notification=email', [1, 3]], ['notification=push', [2, 3]],
    ['role=user&theme=light&notification=push', [3]], ['role=unknown', []],
    ['theme=unknown&notification=unknown', [1, 2, 3, 4]], ['role=&theme=&notification=', [1, 2, 3, 4]],
  ]
  const dashboard = render('/dashboard')
  for (const [query, ids] of cases) {
    const params = new URLSearchParams(query)
    assert.deepEqual(selectUsers(demoUsers, params).map(user => user.id), ids)
    const html = render(`/users?${query}`)
    assert.equal((html.match(/<article /g) ?? []).length, ids.length)
    for (const user of demoUsers) assert.equal(html.includes(`href="/users/${user.id}"`), ids.includes(user.id))
    if (getActiveUserFilters(params).length) assert.ok(html.includes('Rensa filter'))
    else assert.ok(!html.includes('Rensa filter'))
  }
  for (const [query] of cases.slice(0, 8)) assert.ok(dashboard.includes(`href="/users?${query}"`))
  const params = new URLSearchParams('theme=dark&q=erik')
  assert.deepEqual(filterUsers(selectUsers(demoUsers, params), params.get('q')).map(user => user.id), [2])
  assert.ok(render('/users?theme=dark&q=anna').includes('Inga sökresultat'))
  assert.ok(render('/users?theme=dark&q=erik').includes('Visar 1 av 4 användare.'))
  const cleared = clearUserFilters(new URLSearchParams('role=user&theme=dark&notification=email&q=erik&extra=keep'))
  assert.equal(cleared.toString(), 'q=erik&extra=keep')
  assert.equal(params.toString(), 'theme=dark&q=erik')
  assert.deepEqual(demoUsers, original)
  const details = render({ pathname: '/users/2', state: { usersSearch: '?theme=dark&q=erik' } })
  assert.ok(details.includes('href="/users?theme=dark&amp;q=erik"'))
  assert.ok(render('/users/2').includes('href="/users"'))
  assert.ok(render({ pathname: '/users/2', state: { usersSearch: 'https://example.com' } }).includes('href="/users"'))
  console.log('PASS: URL filters, combined search, empty/invalid values, Dashboard links, clear preserving search, profile return; no API requests.')
} finally {
  globalThis.fetch = originalFetch
  client?.clear()
  await server.close()
}
