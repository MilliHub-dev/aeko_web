import {
  CircleDollarSignIcon,
  Compass,
  CompassIcon,
  Home,
  HomeIcon,
  Plus,
  Radio,
  RadioIcon,
  SettingsIcon,
  User
} from "lucide-react";

export const sidebarRoutes = [
  {
    name: "Home",
    path: "/",
    icon: HomeIcon,
  },
  {
    name: "Explore",
    path: "/explore",
    icon: CompassIcon,
  },
  {
    name: "Live Streams",
    path: "/live-streams",
    icon: RadioIcon,
  },
  {
    name: "Wallet",
    path: "/wallet",
    icon: CircleDollarSignIcon,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: SettingsIcon,
  },
];

export const mobileRoutes = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Feeds",
    path: "/feeds",
    Icon: Home,
  },
  {
    name: "Aeko",
    path: "/aeko",
    icon: Plus,
  },
  {
    name: "Live Streams",
    path: "/live-streams",
    icon: Radio,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];
