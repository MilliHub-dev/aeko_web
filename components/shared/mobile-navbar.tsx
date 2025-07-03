import {
  HomeIcon,
  NewspaperIcon,
  PlusCircleIcon,
  RadioIcon,
  UserIcon,
} from "lucide-react";

const routes = [
  {
    name: "Home",
    icon: HomeIcon,
    path: "/",
  },
  {
    name: "Feeds",
    icon: NewspaperIcon,
    path: "/feeds",
  },
  {
    name: "Aeko",
    icon: PlusCircleIcon,
    path: "/create",
  },
  {
    name: "Live Streams",
    icon: RadioIcon,
    path: "/live",
  },
  {
    name: "Profile",
    icon: UserIcon,
    path: "/profile",
  },
];

export default function MobileNavbar() {
  return (
    <div className="flex md:hidden fixed bottom-0 z-10 w-full h-14 bg-background border-t border-gray-700 justify-center items-center">
      <nav className="flex-1 w-full flex items-center justify-between px-4">
        {routes.map((item) => (
          <button
            key={item.name}
            className="p-3 flex flex-col items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors rounded-md"
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
