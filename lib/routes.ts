import { CompassIcon, HomeIcon, PlusIcon, RadioIcon, UserIcon, CircleDollarSignIcon, SettingsIcon } from "lucide-react"



export const sidebarRoutes = [
  {
    name: 'Home',
    path: '/',
    icon: HomeIcon
  },
  {
    name: 'Explore',
    path: '/explore',
    icon: CompassIcon
  },
  {
    name: 'Live Streams',
    path: '/live-streams',
    icon: RadioIcon
  },
  {
    name: 'Wallet',
    path: '/wallet',
    icon: CircleDollarSignIcon
  },
  {
    name: "Settings",
    path: '/settings',
    icon: SettingsIcon
  }
]

export const mobileRoutes = [
  {
    name: 'Home',
    path: '/',
    icon: HomeIcon
  },
  {
    name: 'Feeds',
    path: '/feeds',
    Icon: CompassIcon
  },
  {
    name: 'Aeko',
    path: '/aeko',
    icon: PlusIcon
  },
  {
    name: 'Live Streams',
    path: '/live-streams',
    icon: RadioIcon
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: UserIcon
  }
]
