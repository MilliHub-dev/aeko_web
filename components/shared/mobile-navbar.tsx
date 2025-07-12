import { Bell, CircleDollarSign, Home, Search, User } from "lucide-react";
import Link from "next/link";

const MobileNavbar = () => {
  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "search", icon: Search, label: "Search", path: "/search" },
    { id: "analytics", icon: CircleDollarSign, label: "Analytics", path: "/analytics" },
    { id: "activity", icon: Bell, label: "Activity", path: "/activity" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-primary dark:bg-background border-t border-border/30 z-50">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex flex-col items-center justify-center h-auto py-1 px-3 rounded-lg hover:bg-accent hover:text-primary transition-colors text-blue-gem-50 dark:text-green-yellow-100 ${
                item.path
                  ? ""
                  : ""
              }`}
            >
              <IconComponent className="w-6 h-6" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export { MobileNavbar };
