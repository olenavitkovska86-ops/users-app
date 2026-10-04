export interface User {
  id: number
  username: string
  profile: {
    name: string
    email: string
    address: {
      street: string
      city: string
      zipCode: string
    }
  }
  settings: {
    theme: 'dark' | 'light'
    notifications: {
      email: boolean
      push: boolean
    }
  }
  roles: string[]
}
