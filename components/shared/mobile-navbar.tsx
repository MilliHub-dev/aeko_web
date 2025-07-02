import { NavIcons } from "../icons";

export default function MobileNavbar() {
  return (
    <div className="flex md:hidden fixed bottom-0 z-10 w-full h-14 bg-background border-t border-gray-700 justify-center items-center">
      <nav className="flex-1 w-full flex items-center gap-4">
          {NavIcons.map((item) => (
            <button
              key={item.name}
              className="w-full p-3 flex items-center justify-center xl:justify-start hover:bg-gray-900 transition-colors group relative space-x-2.5 rounded-md"
            >
              <item.icon  />
              <h2 className="hidden xl:block">{item.name}</h2>
            </button>
          ))}
        </nav>
    </div>
  );
}
