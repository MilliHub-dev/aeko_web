"use client";

import { useRouteName } from "@/hooks/use-route-name";
import { mobileRoutes } from "@/lib/routes";
import Link from "next/link";

const MobileNavbar = () => {
  const routeName = useRouteName();

  return (
    <nav className="flex justify-center md:hidden fixed bottom-4 left-0 right-0 bg-transparent z-50 ">
      <div className="flex items-center justify-around px-4 py-3 w-[350px] h-20 backdrop-blur-2xl bg-black/50 rounded-full ">
        {mobileRoutes.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`flex flex-col items-center justify-center p-3 rounded-full hover:bg-accent text-gray-100/30 hover:text-primary transition-colors ${
                item.label === routeName ? "bg-white !text-primary" : "bg-none"
              }`}
            >
              <IconComponent strokeWidth={1.5} size={24} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export { MobileNavbar };
