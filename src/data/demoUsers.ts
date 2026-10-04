import type { User } from '../types/user'

export const demoUsers: User[] = [
  {
    id: 1,
    username: 'anna.demo',
    profile: {
      name: 'Anna Andersson',
      email: 'anna@example.com',
      address: { street: 'Exempelgatan 1', city: 'Stockholm', zipCode: '111 22' },
    },
    settings: { theme: 'light', notifications: { email: true, push: false } },
    roles: ['user', 'admin'],
  },
  {
    id: 2,
    username: 'erik.demo',
    profile: {
      name: 'Erik Lind',
      email: 'erik@example.com',
      address: { street: 'Exempelvägen 2', city: 'Göteborg', zipCode: '411 11' },
    },
    settings: { theme: 'dark', notifications: { email: false, push: true } },
    roles: ['editor'],
  },
  {
    id: 3,
    username: 'sara.demo',
    profile: {
      name: 'Sara Berg',
      email: 'sara@example.com',
      address: { street: 'Exempelgatan 3', city: 'Malmö', zipCode: '211 22' },
    },
    settings: { theme: 'light', notifications: { email: true, push: true } },
    roles: ['user', 'support'],
  },
  {
    id: 4,
    username: 'oskar.demo',
    profile: {
      name: 'Oskar Nilsson',
      email: 'oskar@example.com',
      address: { street: 'Exempelvägen 4', city: 'Uppsala', zipCode: '753 10' },
    },
    settings: { theme: 'dark', notifications: { email: false, push: false } },
    roles: ['user'],
  },
]
