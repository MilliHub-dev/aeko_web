import { CircleDollarSignIcon } from "@/components/ui/circle-dollar-sign"
import { CompassIcon } from "@/components/ui/compass"
import { HomeIcon } from "@/components/ui/home"
import { PlusIcon } from "@/components/ui/plus"
import { RadioIcon } from "@/components/ui/radio"
import { SettingsGearIcon } from "@/components/ui/settings-gear"
import { UserIcon } from "@/components/ui/user"

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
    icon: SettingsGearIcon
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
