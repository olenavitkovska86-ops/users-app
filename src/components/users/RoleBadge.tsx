interface RoleBadgeProps {
  role: string
  theme?: 'light' | 'dark'
}

export default function RoleBadge({ role, theme = 'light' }: RoleBadgeProps) {
  let label = role

  switch (role) {
    case 'user':
      label = 'Användare'
      break
    case 'admin':
      label = 'Administratör'
      break
    case 'editor':
      label = 'Redaktör'
      break
    case 'support':
      label = 'Support'
      break
  }

  return (
    <span className={`inline-flex max-w-full break-all rounded-full border px-3 py-1 text-sm font-medium ${theme === 'dark' ? 'border-[#626070] bg-[#464451] text-[#d5ccdf]' : 'border-violet-200 bg-violet-50 text-violet-800'}`}>
      {label}
    </span>
  )
}
