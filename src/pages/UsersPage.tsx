import UserList from '../components/users/UserList'
import UserSearch from '../components/users/UserSearch'
import { demoUsers } from '../data/demoUsers'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Användare</h1>
        <p className="mt-2 text-slate-600">
          Förhandsvisning med fiktiva användare. Inga uppgifter har hämtats från API:et.
        </p>
      </div>
      <UserSearch />
      <UserList users={demoUsers} />
    </div>
  )
}
