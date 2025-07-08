const LeftSidebar = () => {
  return (
    <aside className="hidden md:block fixed left-[max(0px,calc(50%-640px))] top-16 bottom-0 w-16 lg:w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-2 lg:p-4 h-full">
        <div className="bg-green-100 border-2 border-dashed border-green-300 rounded-lg p-2 lg:p-4 h-full flex items-center justify-center">
          <div className="text-center">
            <span className="text-green-600 font-medium block text-xs lg:text-base">
              <span className="lg:hidden">Nav</span>
              <span className="hidden lg:block">Left Sidebar</span>
            </span>
            <span className="text-green-500 text-xs hidden lg:block">
              Navigation Menu
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export { LeftSidebar };