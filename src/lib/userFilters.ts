import type { User } from '../types/user'

const roleLabels: Record<string, string> = {
  user: 'Användare', admin: 'Administratör', editor: 'Redaktör', support: 'Support',
}

function readFilters(params: URLSearchParams): {
  role: string | null
  theme: 'light' | 'dark' | null
  notification: 'email' | 'push' | null
} {
  const role = params.get('role')
  const theme = params.get('theme')
  const notification = params.get('notification')
  return {
    role: role && role.trim() ? role : null,
    theme: theme === 'light' || theme === 'dark' ? theme : null,
    notification: notification === 'email' || notification === 'push' ? notification : null,
  }
}

export function selectUsers(users: User[], params: URLSearchParams) {
  const { role, theme, notification } = readFilters(params)
  return users.filter((user) =>
    (!role || user.roles.includes(role)) &&
    (!theme || user.settings.theme === theme) &&
    (!notification || user.settings.notifications[notification]),
  )
}

export function getActiveUserFilters(params: URLSearchParams) {
  const { role, theme, notification } = readFilters(params)
  const labels: string[] = []
  if (role) labels.push(`Roll: ${Object.hasOwn(roleLabels, role) ? roleLabels[role] : role}`)
  if (theme) labels.push(`Tema: ${theme === 'dark' ? 'Mörkt' : 'Ljust'}`)
  if (notification) labels.push(`${notification === 'email' ? 'E-postaviseringar' : 'Pushaviseringar'}: Aktiverade`)
  return labels
}

export function clearUserFilters(params: URLSearchParams) {
  const next = new URLSearchParams(params)
  for (const key of ['role', 'theme', 'notification']) next.delete(key)
  return next
}
