const Header = () => {
  return (
    <header className="hidden md:block fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-full">
          <div className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg px-6 py-2">
            <span className="text-blue-600 font-medium">Header / Top Navigation</span>
          </div>
        </div>
      </header>
  );
};

export { Header };