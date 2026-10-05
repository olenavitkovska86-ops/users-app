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
  const { filterUsers } = await server.ssrLoadModule('/src/lib/filterUsers.ts')
  const { demoUsers } = await server.ssrLoadModule('/src/data/demoUsers.ts')
  const { default: UserSearch } = await server.ssrLoadModule('/src/components/users/UserSearch.tsx')
  const { default: EmptyState } = await server.ssrLoadModule('/src/components/states/EmptyState.tsx')
  const { default: App } = await server.ssrLoadModule('/src/App.tsx')
  queryClient = (await server.ssrLoadModule('/src/lib/queryClient.ts')).queryClient

  let calls = 0
  globalThis.fetch = async () => { calls++; assert.fail('Search checks must not access the API') }
  queryClient.setQueryData(['users'], demoUsers)
  const originalUsers = structuredClone(demoUsers)
  const cases = [
    ['', [1, 2, 3, 4]], ['   ', [1, 2, 3, 4]], ['anna', [1]], ['ANDERSSON', [1]],
    ['erik.demo', [2]], ['sara@example.com', [3]], ['  Göteborg  ', [2]],
    ['MALMÖ', [3]], ['ö', [2, 3]], ['example.com', [1, 2, 3, 4]],
    ['unknown-name', []], ['admin', []], ['Exempelgatan', []],
  ]
  for (const [text, ids] of cases) {
    assert.deepEqual(filterUsers(demoUsers, text).map((user) => user.id), ids)
  }
  assert.deepEqual(filterUsers([], 'anna'), [])
  assert.deepEqual(demoUsers, originalUsers)
  console.log('PASS: 14 search cases; required fields only, case/whitespace handling, no data mutation.')

  function findElement(node, type) {
    if (!node || typeof node !== 'object') return undefined
    if (Array.isArray(node)) {
      for (const child of node) {
        const result = findElement(child, type)
        if (result) return result
      }
      return undefined
    }
    return node.type === type ? node : findElement(node.props?.children, type)
  }

  let value = ''
  const props = { value, onChange: (text) => { value = text }, onClear: () => { value = '' } }
  const emptySearch = UserSearch(props)
  assert.equal(findElement(emptySearch, 'button'), undefined)
  const input = findElement(emptySearch, 'input')
  assert.equal(input.props.value, '')
  assert.equal(input.props.readOnly, undefined)
  input.props.onChange({ currentTarget: { value: 'Erik' } })
  assert.equal(value, 'Erik')
  assert.deepEqual(filterUsers(demoUsers, value).map((user) => user.id), [2])
  const filledSearch = UserSearch({ ...props, value })
  assert.equal(findElement(filledSearch, 'input').props.value, 'Erik')
  const clearButton = findElement(filledSearch, 'button')
  assert.equal(clearButton.props.type, 'button')
  clearButton.props.onClick()
  assert.equal(value, '')
  assert.equal(filterUsers(demoUsers, value).length, demoUsers.length)
  console.log('PASS: controlled search callbacks and clear restore the full list.')

  const noResults = renderToStaticMarkup(createElement(EmptyState, {
    title: 'Inga sökresultat', message: 'Prova ett annat sökord.', headingLevel: 'h2',
  }))
  assert.ok(noResults.includes('<h2 '))
  assert.ok(noResults.includes('Inga sökresultat'))
  assert.ok(!noResults.includes('<h1 '))
  console.log('PASS: reusable no-results state uses the correct heading level.')

  function render(path) {
    return renderToStaticMarkup(createElement(QueryClientProvider, { client: queryClient },
      createElement(MemoryRouter, { initialEntries: [path] }, createElement(App))))
  }

  const users = render('/users')
  assert.ok(users.includes('Visar 4 av 4 användare.'))
  assert.ok(users.includes('for="user-search"'))
  for (const user of demoUsers) {
    const html = render(`/users/${user.id}`)
    assert.ok(html.includes(`<dd>${user.settings.theme === 'light' ? 'Ljust' : 'Mörkt'}</dd>`))
    assert.ok(html.includes(`<dt class="font-medium">E-postaviseringar</dt><dd>${user.settings.notifications.email ? 'Aktiverade' : 'Avstängda'}</dd>`))
    assert.ok(html.includes(`<dt class="font-medium">Pushaviseringar</dt><dd>${user.settings.notifications.push ? 'Aktiverade' : 'Avstängda'}</dd>`))
    assert.ok(!html.includes('<input'))
  }
  assert.equal(calls, 0)
  console.log('PASS: result count and all settings values on four details pages; zero API requests.')
  console.log('Typing, clear-button clicks, no-results page interaction and keyboard focus still need browser verification.')
} finally {
  globalThis.fetch = originalFetch
  queryClient?.clear()
  await server.close()
}
