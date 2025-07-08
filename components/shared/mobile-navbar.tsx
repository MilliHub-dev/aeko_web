const MobileNavbar = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around px-4 pt-3">
        {["Home", "Search", "Create", "Activity", "Profile"].map((item) => (
          <div
            key={item}
            className="bg-red-100 border border-red-300 rounded-lg px-3 py-2 flex-1 mx-1"
          >
            <div className="text-center">
              <div className="bg-red-200 rounded-full w-6 h-6 mx-auto mb-1"></div>
              <span className="text-red-600 text-xs font-medium">{item}</span>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export { MobileNavbar };
