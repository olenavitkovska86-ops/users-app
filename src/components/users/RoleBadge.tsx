interface RoleBadgeProps {
  role: string
}

export default function RoleBadge({ role }: RoleBadgeProps) {
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
    <span className="inline-flex max-w-full break-all rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-800">
      {label}
    </span>
  )
}
