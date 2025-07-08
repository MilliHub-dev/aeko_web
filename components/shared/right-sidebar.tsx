const RightSidebar = () => {
  return (
    <aside className="hidden xl:block fixed right-[max(0px,calc(50%-640px))] top-16 bottom-0 w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 h-full">
        <div className="space-y-4">
          {/* Trending/Suggestions Section */}
          <div className="bg-orange-100 border-2 border-dashed border-orange-300 rounded-lg p-4">
            <span className="text-orange-600 font-medium block mb-2">
              Right Sidebar
            </span>
            <span className="text-orange-500 text-sm">
              Trending / Suggestions
            </span>
          </div>

          {/* Additional Right Sidebar Content */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-3">
                  <div className="bg-orange-200 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-orange-600 text-xs">S{item}</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-orange-100 rounded h-4 mb-1"></div>
                    <div className="bg-orange-100 rounded h-3 w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Who to Follow Section */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="bg-orange-200 rounded px-3 py-2 mb-3 text-center">
              <span className="text-orange-600 text-sm font-medium">
                Who to Follow
              </span>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="bg-orange-200 rounded-full w-6 h-6"></div>
                    <div className="bg-orange-100 rounded h-3 w-16"></div>
                  </div>
                  <div className="bg-orange-200 rounded px-2 py-1">
                    <span className="text-orange-600 text-xs">Follow</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export { RightSidebar };
