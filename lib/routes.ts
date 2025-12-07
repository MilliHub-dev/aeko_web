import {
  Plus,
  SettingsIcon,
  SearchIcon,
  UsersIcon,
  CoinsIcon,
} from "lucide-react";
import {
  BellIcon,
  ChatIcon,
  ChatSquareOutline,
  HomeIcon,
  RadioSolid,
  UserOutline,
  UsersGroup,
  WalletOutline,
} from "./icons";

export const sidebarRoutes = [
  {
    name: "Home",
    path: "/home",
    icon: HomeIcon,
  },
  {
    name: "Explore",
    path: "/explore",
    icon: SearchIcon,
  },
  {
    name: "Communities",
    path: "/communities",
    icon: UsersGroup,
  },
  {
    name: "Live Streams",
    path: "/live-streams",
    icon: RadioSolid,
  },
  // {
  //   name: "Messages",
  //   path: "/messages",
  //   icon: ChatIcon,
  // },
  // {
  //   name: "Notifications",
  //   path: "/notifications",
  //   icon: BellIcon,
  // },
  // {
  //   name: "Aeko Wallet",
  //   path: "/wallet",
  //   icon: WalletOutline,
  // },
  // {
  //   name: "NFT Marketplace",
  //   path: "/nft-marketplace",
  //   icon: CoinsIcon,
  // },
  {
    name: "Profile",
    path: "/profile",
    icon: UserOutline,
  },
  // {
  //   name: "Settings",
  //   path: "/settings",
  //   icon: SettingsIcon,
  // },
];

export const mobileRoutes = [
  {
    id: "home",
    label: "Home",
    path: "/home",
    icon: HomeIcon,
  },
  {
    id: "explore",
    label: "Explore",
    path: "/explore",
    icon: SearchIcon,
  },
  {
    id: "aeko",
    label: "Aeko",
    path: "/aeko",
    icon: Plus,
  },
  {
    id: "live-stream",
    label: "Live Streams",
    path: "/live-streams",
    icon: RadioSolid,
  },
  {
    id: "profile",
    label: "Profile",
    path: "/profile",
    icon: UserOutline,
  },
];
