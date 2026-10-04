import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: 'custom',
})
const originalFetch = globalThis.fetch
let checks = 0

try {
  const { fetchUsers, UsersApiError } = await server.ssrLoadModule('/src/api/users.ts')
  const { demoUsers } = await server.ssrLoadModule('/src/data/demoUsers.ts')
  const validUser = demoUsers[0]

  function mockJson(data) {
    globalThis.fetch = async () => Response.json(data)
  }

  async function expectError(kind, status) {
    await assert.rejects(fetchUsers(), (error) => {
      assert.ok(error instanceof UsersApiError)
      assert.equal(error.kind, kind)
      assert.equal(error.status, status)
      return true
    })
    checks++
  }

  const signal = new AbortController().signal
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api-userapi.onrender.com/api/users/getUsers')
    assert.equal(options.method, 'GET')
    assert.equal(new Headers(options.headers).get('x-api-key'), 'elev-hemlighet-2026')
    assert.equal(options.signal, signal)
    return Response.json(demoUsers)
  }
  assert.deepEqual(await fetchUsers(signal), demoUsers)
  checks++

  mockJson([])
  assert.deepEqual(await fetchUsers(), [])
  checks++
  mockJson([{ ...validUser, roles: ['future-role'], settings: { ...validUser.settings, theme: 'dark' } }])
  assert.equal((await fetchUsers())[0].roles[0], 'future-role')
  checks++

  for (const status of [401, 403, 404, 429, 500, 503]) {
    globalThis.fetch = async () => new Response('not JSON', { status })
    await expectError('http', status)
  }
  globalThis.fetch = async () => new Response('', { status: 429, headers: { 'Retry-After': '120' } })
  await assert.rejects(fetchUsers(), (error) => error instanceof UsersApiError && error.retryAfter === '120')
  checks++

  globalThis.fetch = async () => { throw new TypeError('mock connection failure') }
  await expectError('network')
  globalThis.fetch = async () => new Response('{invalid')
  await expectError('invalid-json')

  const invalidValues = [
    null, {}, 'users', [null], [42], [validUser, null],
    [{ ...validUser, id: '1' }],
    [{ ...validUser, username: null }],
    [{ ...validUser, profile: null }],
    [{ ...validUser, settings: [] }],
    [{ ...validUser, profile: { ...validUser.profile, address: null } }],
    [{ ...validUser, settings: { ...validUser.settings, theme: 'blue' } }],
    [{ ...validUser, settings: { ...validUser.settings, notifications: null } }],
    [{ ...validUser, roles: 'user' }],
    [{ ...validUser, roles: [7] }],
  ]
  for (const data of invalidValues) {
    mockJson(data)
    await expectError('invalid-structure')
  }

  for (const path of [
    ['id'], ['username'], ['roles'], ['profile', 'name'], ['profile', 'email'],
    ['profile', 'address', 'street'], ['profile', 'address', 'city'], ['profile', 'address', 'zipCode'],
    ['settings', 'theme'], ['settings', 'notifications', 'email'], ['settings', 'notifications', 'push'],
  ]) {
    const user = structuredClone(validUser)
    let parent = user
    for (const key of path.slice(0, -1)) parent = parent[key]
    delete parent[path.at(-1)]
    mockJson([user])
    await expectError('invalid-structure')
  }

  for (const key of ['email', 'push']) {
    const user = structuredClone(validUser)
    user.settings.notifications[key] = 'true'
    mockJson([user])
    await expectError('invalid-structure')
  }

  const beforeFetch = new AbortController()
  const reason = new Error('mock cancellation')
  beforeFetch.abort(reason)
  globalThis.fetch = async () => { assert.fail('Aborted request must not start') }
  await assert.rejects(fetchUsers(beforeFetch.signal), (error) => error === reason)
  checks++

  const duringFetch = new AbortController()
  globalThis.fetch = async () => {
    duringFetch.abort(reason)
    throw new TypeError('mock aborted transport')
  }
  await assert.rejects(fetchUsers(duringFetch.signal), (error) => error === reason)
  checks++

  const abortError = new DOMException('mock abort', 'AbortError')
  globalThis.fetch = async () => { throw abortError }
  await assert.rejects(fetchUsers(), (error) => error === abortError)
  checks++

  const duringBody = new AbortController()
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => { duringBody.abort(reason); throw abortError },
  })
  await assert.rejects(fetchUsers(duringBody.signal), (error) => error === reason)
  checks++

  globalThis.fetch = async () => ({ ok: true, json: async () => { throw new TypeError('mock body failure') } })
  await expectError('network')

  console.log(`PASS: ${checks} API mock scenarios. No real API requests.`)
} finally {
  globalThis.fetch = originalFetch
  await server.close()
}
