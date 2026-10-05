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
let queryClient

try {
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  const { demoUsers } = await server.ssrLoadModule('/src/data/demoUsers.ts')
  queryClient = (await server.ssrLoadModule('/src/lib/queryClient.ts')).queryClient
  queryClient.setQueryData(['users'], demoUsers)

  function render(path) {
    return renderToStaticMarkup(
      createElement(QueryClientProvider, { client: queryClient },
        createElement(MemoryRouter, { initialEntries: [path] }, createElement(App))),
    )
  }

  function assertLayout(html) {
    assert.equal((html.match(/<header /g) ?? []).length, 1)
    assert.equal((html.match(/<aside /g) ?? []).length, 1)
    assert.equal((html.match(/<h1 /g) ?? []).length, 1)
    assert.ok(html.includes('Skrivskyddad vy'))
  }

  function assertActiveLink(html, path) {
    const link = html.match(new RegExp(`<a[^>]*href="${path}"[^>]*>`))?.[0]
    assert.ok(link?.includes('aria-current="page"'))
  }

  const dashboard = render('/dashboard')
  assertLayout(dashboard)
  assertActiveLink(dashboard, '/dashboard')
  assert.ok(dashboard.includes('Totalt antal användare'))
  assert.ok(dashboard.includes('En användare kan ha flera roller.'))
  assert.ok(dashboard.includes(`>${demoUsers.length}</p>`))

  const users = render('/users')
  assertLayout(users)
  assertActiveLink(users, '/users')
  assert.equal((users.match(/<article /g) ?? []).length, demoUsers.length)
  for (const user of demoUsers) {
    assert.ok(users.includes(`href="/users/${user.id}"`))
    const details = render(`/users/${user.id}`)
    assertLayout(details)
    assertActiveLink(details, '/users')
    assert.ok(details.includes(user.profile.name))
    assert.ok(details.includes(user.profile.email))
    assert.ok(details.includes(user.profile.address.street))
    assert.ok(details.includes('href="/users"'))
  }

  for (const path of ['/users/999', '/users/abc', '/users/1.5', '/users/9007199254740992']) {
    const html = render(path)
    assertLayout(html)
    assert.ok(html.includes('Användaren hittades inte'))
    assert.ok(html.includes('href="/users"'))
  }

  const missing = render('/unknown-page')
  assertLayout(missing)
  assert.ok(missing.includes('Sidan hittades inte'))
  assert.ok(missing.includes('href="/dashboard"'))
  console.log('PASS: 11 route renders, shared layout, active navigation, details links and invalid user IDs.')
  console.log('Browser redirect, back/forward, clicks and focus still need browser verification.')
} finally {
  queryClient?.clear()
  await server.close()
}
